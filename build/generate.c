/** 
 * This script will pre-generate my website by writing the data JSON file 
 * into separate pages and then linking those pages back into the site.
 *
 * My index HTML page contains the keywords PROJECTS_START
 * and JOURNAL_START. This program will go through line by line of the 
 * HTML file until it finds either of these keywords.
 * If the keyword is found it will load the respective data from the JSON 
 * file and iterate through it while adding it to the index file. This will 
 * be done until all the data has been written through. The program will print 
 * the generated file to standard output which can be piped into a file.
 *
 * Compilation:
 * `gcc -o gen generate.c remote/cJSON/cJSON.c remote/plib/plib.c -O2`
 * **/

#include "remote/cJSON/cJSON.h"
#include "remote/plib/plib.h"
#include <string.h>
#include <stdlib.h>
#include <stdio.h>


#define BUF_SIZE 256
#define PROJECT_TRIGGER "PROJECT_START"
#define JOURNAL_TRIGGER "JOURNAL_START"


static void print_journal_code(FILE *);
static void print_project_code(FILE *);

static int json_file_size;
static char *json_buffer;

static size_t line_buf_size;
static char *line_buf;

static FILE *json;
static FILE *html;

static cJSON *json_obj;


void 
quit(int code)
{
	if(json != NULL)
		fclose(json);

	if(html != NULL)
		fclose(html);

	if(json_buffer != NULL)
		free(json_buffer);
	
	cJSON_Delete(json_obj);

	exit(code);
}


int 
main(const int argc, char *argv[])
{
	pl_arg *help = PL_A("--help", "Show this dialog.", .short_flag = "-h");
	pl_arg *i_html = PL_A("--input-html", "Enter HTML file to read from.", .short_flag = "-i", .cat = "Input", .takes_value = 1);
	pl_arg *i_json = PL_A("--input-json", "Enter JSON file to read from.", .short_flag = "-j", .cat = "Input", .takes_value = 1);
	pl_arg *e_buf  = PL_A("--buff", "Set the line buffer size.", .short_flag = "-b", .cat="Input/Extra", .takes_value = 1,);
	pl_arg *e_trig_jrnl = PL_A("--journal-trigger", "Set trigger phrase to write journal data at.", .short_flag = "-t", .cat="Input/Extra", .takes_value = 1);
	pl_arg *e_trig_proj = PL_A("--project-trigger", "Set trigger phrase to write project data at.", .short_flag = "-p", .cat="Input/Extra", .takes_value = 1);
	pl_arg *d_print = PL_A("--print-defaults", "Print default values.", .cat="Extra", .takes_value = 1);
	pl_r rc;

	// If error occurred or help flag run
	if((rc = PL_PROC()) != PL_SUCCESS || PL_R(help)){
		pl_help();

		// Print error
		if (!PL_R(help))
			PL_E_INFO(rc);

		return 1;
	}

	// Handle extra arguments ;3
	if(PL_R(d_print)){
		printf("--buff            : %d\n", BUF_SIZE);
		printf("--journal-trigger : %s\n", JOURNAL_TRIGGER);
		printf("--project-trigger : %s\n", PROJECT_TRIGGER);
		return 0;
	}

	// Check inputs
	if(!PL_R(i_html)){
		fprintf(stderr, "Error: provide a HTML file\n");
		return 1;
	}
	if(!PL_R(i_json)){
		fprintf(stderr, "Error: provide a JSON file\n");
		return 1;
	}

	FILE *html = fopen(PL_G(i_html), "r");
	FILE *json = fopen(PL_G(i_json), "r");


	// Check files 
	if(html == NULL){
		fprintf(stderr, "Error: could not open HTML file: %s\n", PL_G(i_html));
		return 1;
	}

	if(json == NULL){
		fprintf(stderr, "Error: could not open JSON file: %s\n", PL_G(i_json));
		return 1;
	}

	// Get JSON file size 
	fseek(json, 0L, SEEK_END);
	json_file_size = ftell(json);
	fseek(json, 0L, SEEK_SET);

	json_buffer = malloc(json_file_size);
	if(!json_buffer){
		fprintf(stderr, "Error: memory allocation failed in print_journal_code\n");
		quit(1);
	}

	// Parse JSON file 
	int len = fread(json_buffer, 1, json_file_size, json);
	json_obj = cJSON_Parse(json_buffer);

	if(json_obj == NULL){
		const char *err = cJSON_GetErrorPtr();
		if(err != NULL)
			fprintf(stderr, "Error: failed to parse JSON file: %s\n", err);
	
		quit(1);
	}
	
	// I'm aware we can f-close JSON here. 
	
	// Validate buffer number 
	if(PL_R(e_buf)){
		line_buf_size = atoi(PL_G(e_buf));

		if(line_buf_size == 0 && strcmp(PL_G(e_buf), "0") != 0){
			fprintf(stderr, "Error: please enter a valid number\n");
			return 1;
		} else 
		if (line_buf_size < BUF_SIZE){
			fprintf(stderr, "Error: buffer size to low. please enter a value larger then %d\n", BUF_SIZE);
			return 1;
		};

		line_buf = malloc(line_buf_size);
	} else 
		line_buf = malloc(BUF_SIZE);

	if(!line_buf){
		fprintf(stderr, "Error: memory issue allocating for buf\n");
		exit(1);
	}

	// Start reading HTML file
	while(fgets(line_buf, line_buf_size, html)){

		/** 
		 * This block will use either the user set 
		 * journal/project trigger value or it will 
		 * default to the built-in values. The 
		 * reason this block uses the same 
		 * functions twice is because setting the 
		 * one of two value to another variable 
		 * would use some form of memory allocation.
		 * Of course so I've opted for the lazy 
		 * and most likely more optimized method. 
		 **/
		if(PL_R(e_trig_jrnl)){
			if(strstr(line_buf, PL_G(e_trig_jrnl))){
				// Catch journal data
				print_journal_code(json);

			}
		} else 
		if(strstr(line_buf, JOURNAL_TRIGGER)){
			// Catch journal data
			print_journal_code(json);

		} else 
		if(PL_R(e_trig_proj)){
			if(strstr(line_buf, PL_G(e_trig_proj))){
				// Catch project code 
				print_project_code(json);

			}
		} else 
		if (strstr(line_buf, PROJECT_TRIGGER)){
			// Catch project code
			print_project_code(json);

		};
		
		// Print line, no lines are truncated
		printf("%s", line_buf);
	}

	// Clean up
	printf("<!-- End of file reached -->\n");
	exit(0);
}


static void
print_journal_code(FILE * f)
{
	if(json_obj == NULL) return;

	cJSON *journal_f = cJSON_GetObjectItem(json_obj, "journal");

	// Invert array
	size_t array_size = cJSON_GetArraySize(journal_f);
	cJSON *journal = cJSON_CreateArray();

	for(int i = array_size - 1; i >= 0; i--){
		cJSON *item = cJSON_GetArrayItem(journal_f, i);
		cJSON_AddItemToArray(journal, cJSON_Duplicate(item, 1));
	}

	cJSON *item = NULL;
	int index;

	// Loop through array
	cJSON_ArrayForEach(item, journal){
		printf("<pre><br>");
		char *title = cJSON_GetObjectItemCaseSensitive(item, "title")->valuestring;
		char *date = cJSON_GetObjectItemCaseSensitive(item, "date")->valuestring;
		char *content = cJSON_GetObjectItemCaseSensitive(item, "content")->valuestring;

		// Print data
		printf("title    : <a href=\"?p=%lu\">%s</a>\ntags     : ", array_size - index - 1, title);
		
		// Print tags
		cJSON *tag = NULL;
		int first = 0;
		
		cJSON_ArrayForEach(tag, cJSON_GetObjectItemCaseSensitive(item,"tags")){
			if(!first){
				first = 1;
			} else printf(", ");
			
			printf("%s", tag->valuestring);
		}

		printf("\nposted   : <span class=\"utc\">%s</span>\ndate    : %s\n", date, date);
		
		for(int i = 0; i < 20; ++i){
			printf("-");
		}

		printf("\n%s\n", content);
		index++;

		printf("<br></pre>\n<br>\n");
	}
	
	return;
}

static void
print_project_code(FILE * f)
{
	if(json_obj == NULL) return;

	cJSON *project_f = cJSON_GetObjectItem(json_obj, "project");

	// Invert array
	size_t array_size = cJSON_GetArraySize(project_f);
	cJSON *project = cJSON_CreateArray();

	for(int i = array_size - 1; i >= 0; i--){
		cJSON *item = cJSON_GetArrayItem(project_f, i);
		cJSON_AddItemToArray(project, cJSON_Duplicate(item, 1));
	}

	cJSON *item = NULL;

	// Loop through array
	cJSON_ArrayForEach(item, project){
		printf("<pre><br>");
		char *name = cJSON_GetObjectItemCaseSensitive(item, "name")->valuestring;
		char *url = cJSON_GetObjectItemCaseSensitive(item, "url")->valuestring;
		char *brief = cJSON_GetObjectItemCaseSensitive(item, "tagline")->valuestring;

		// Print data
		printf("name    : %s\ntags    : ", name);
		
		// Print tags
		cJSON *tag = NULL;
		int first = 0;
		
		cJSON_ArrayForEach(tag, cJSON_GetObjectItemCaseSensitive(item,"tags")){
			if(!first){
				first = 1;
			} else printf(", ");
			
			printf("%s", tag->valuestring);
		}

		printf("\ntagline : %s\nurl     : <a href=\"%s\">%s</a>\n", brief, url, url);
		
		for(int i = 0; i < 20; ++i){
			printf("-");
		}

		printf("\n");

		cJSON *desc = NULL;
		cJSON_ArrayForEach(desc, cJSON_GetObjectItemCaseSensitive(item, "description")){
			cJSON *file_list = cJSON_GetObjectItemCaseSensitive(desc, "file");
			char* cont = cJSON_GetObjectItemCaseSensitive(desc, "cont")->valuestring;
			
			if(cJSON_GetArraySize(file_list) > 0 ){
				printf("<span class=\"file-list\">");
				cJSON *file = NULL;
				cJSON_ArrayForEach(file, file_list){
					char *file_name = file->valuestring;
					printf("%s, ", file_name);
				}
				printf("</span>");
			}

			printf("%s\n", cont);
		}

		printf("<br></pre>\n<br>\n");
	}

	return;
}
