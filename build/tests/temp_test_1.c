#include <stdio.h>
#include <string.h>
#include <stdlib.h>

struct tok {
	int s;  // start 
	int e;  // end 
	char*v; // value
};

int 
main(int argc, char *argv[])
{
	char* trigger = "__JOURNAL_HERE__";
	char template[] = "<span><!--$NAME--></span>\n<span><!--$DESC-->></span>";
	char* delim="<!--$";
	
	char* f_delim = malloc(sizeof(char)); 
	*f_delim = delim[strlen(delim)-1];

	char* tok;

	// loop through delimiters 
	tok = strtok(template, f_delim);

	while(tok){
		int matches = 0;

		// Check if token matches delim patten
		for(int i = 0; i < strlen(delim); i++)
			if(delim[strlen(delim)-2-i] == tok[strlen(tok)-1-i])
				matches ++;

		// Increment token 
		tok = strtok(NULL, f_delim);
		
		// If token matched pattern 
		if(matches == strlen(delim)-1){
			char* ptr = strchr(tok, delim[strlen(delim)-2]); 
			if(ptr == NULL){
				fprintf(stderr,"Something went wrong with token %s\n", tok);
				return -1;
			}

			int e = ptr - tok;
			tok[e] = '\0';
			printf("%s\n", tok);

			tok[e] = ' ';	
		}	
	}

	free(f_delim);
	return 0;
}
