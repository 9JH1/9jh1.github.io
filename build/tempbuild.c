#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdint.h>

#include "remote/cJSON/cJSON.h"

// String-length
#define sl(s) (int)strlen(s)

// End of string
#define se(s) s[sl(s)-1]

static char *repl_str(const char *, const char *, const char *);
static char *get_json_value(cJSON *, const char *);
static cJSON * get_json_path(cJSON *, char *);
static char *sub_template(char *, cJSON *);


#define DLIM_START "<!--$"
#define DLIM_END "-->"

static char *_DLIM_START = NULL;
static char *_DLIM_END = NULL;

int
main(int argc, char *argv[])
{
	char  template[] = "<span><!--$title--></span>\n<span><!--$desc--></span>";
	char json_path[] = "data.test";
	char json_file_path[] = "./test_data.json";

	// Load json file into string buffer 
	FILE* fjson = fopen(json_file_path, "r");
	cJSON *json;
	fseek(fjson, 0L, SEEK_END);
	int json_s = ftell(fjson);
	fseek(fjson, 0L, SEEK_SET);
	
	char *json_buf = malloc(json_s);
	fread(json_buf, 1, json_s, fjson);
	
	// Parse string json buffer
	json = cJSON_Parse(json_buf);

	if(json == NULL){
		const char *err = cJSON_GetErrorPtr();
		if(err != NULL)
			fprintf(stderr, "Error: failed to parse JSON file.\n");
	}

	// Go to correct scope of json
	cJSON *scope = get_json_path(json, json_path);
	if(scope == NULL){
		fprintf(stderr, "Error: failed to find path '%s' in json file '%s'.\n",
			json_path,
			json_file_path);
	}

	char *out = sub_template(template, scope);
	printf("%s\n",out);


	// Cleanup
	free(json_buf);
	cJSON_Delete(json);
	fclose(fjson);
	return 0;
}


char *
sub_template(char *template, cJSON *json)
{
	char* delim = _DLIM_START;
	char* end_delim = _DLIM_END;

	if(!delim)
		delim = DLIM_START;

	if(!end_delim)
		end_delim = DLIM_END;
	
	// Meta
	char* f_delim = malloc(sizeof(char));
	char* tok;
	char* _template = strdup(template);

	*f_delim = se(delim);
	tok = strtok(template, f_delim);

	// Loop through delimiters 
	while(tok)
	{	
		// Pattern matches 
		int pm = 0;

		// Check if token matches delim pattern
		for(int i = 0; i < sl(delim); i++)
			if(delim[sl(delim)-2-i] == tok[sl(tok)-1-i])
				pm ++;

		// Increment token 
		tok = strtok(NULL, f_delim);
		
		// From the loop before `pm` is the number of matches 
		// that token had with the pattern. if the number of 
		// matches is the same as the string length of delim 
		// then the token matches the patern perfectly and 
		// is flagged by the below system.
		if(pm == sl(delim)-1){
			char* ptr = strchr(tok, delim[sl(delim)-2]); 

			// Token is missing correct end delimiter
			if(ptr == NULL){
				fprintf(stderr,"Something went wrong with token %s\n", tok);
				return NULL;
			}

			// Cut the string at the end delimiter to get 
			// just the variable name.
			int e = ptr - tok;
			tok[e] = '\0';

			// Replace the entire delimter in the template
			char* val = get_json_value(json,tok);
			int repl_s = snprintf(NULL, 0, "%s%s%s", delim, tok, end_delim)+1;
			char *repl = malloc(repl_s);
			
			snprintf(repl, repl_s, "%s%s%s", delim, tok, end_delim); 
			_template= repl_str(_template, repl, val);

			// Clean up
			free(val); 
			free(repl);
			tok[e] = ' ';	
		}	
	}
	
	free(f_delim);
	return _template;
}


static char *
repl_str(const char *str, const char *from, const char *to)
{
	/* Adjust each of the below values to suit your needs. */
	/* Increment positions cache size initially by this number. */
	size_t cache_sz_inc = 16;
	/* Thereafter, each time capacity needs to be increased,
	 * multiply the increment by this factor. */
	const size_t cache_sz_inc_factor = 3;
	/* But never increment capacity by more than this number. */
	const size_t cache_sz_inc_max = 1048576;

	char *pret, *ret = NULL;
	const char *pstr2, *pstr = str;
	size_t i, count = 0;
	#if (__STDC_VERSION__ >= 199901L)
	uintptr_t *pos_cache_tmp, *pos_cache = NULL;
	#else
	ptrdiff_t *pos_cache_tmp, *pos_cache = NULL;
	#endif
	size_t cache_sz = 0;
	size_t cpylen, orglen, retlen, tolen, fromlen = strlen(from);

	/* Find all matches and cache their positions. */
	while ((pstr2 = strstr(pstr, from)) != NULL) {
		count++;

		/* Increase the cache size when necessary. */
		if (cache_sz < count) {
			cache_sz += cache_sz_inc;
			pos_cache_tmp = realloc(pos_cache, sizeof(*pos_cache) * cache_sz);
			if (pos_cache_tmp == NULL) {
				goto end_repl_str;
			} else pos_cache = pos_cache_tmp;
			cache_sz_inc *= cache_sz_inc_factor;
			if (cache_sz_inc > cache_sz_inc_max) {
				cache_sz_inc = cache_sz_inc_max;
			}
		}

		pos_cache[count-1] = pstr2 - str;
		pstr = pstr2 + fromlen;
	}

	orglen = pstr - str + strlen(pstr);

	/* Allocate memory for the post-replacement string. */
	if (count > 0) {
		tolen = strlen(to);
		retlen = orglen + (tolen - fromlen) * count;
	} else	retlen = orglen;
	ret = malloc(retlen + 1);
	if (ret == NULL) {
		goto end_repl_str;
	}

	if (count == 0) {
		/* If no matches, then just duplicate the string. */
		strcpy(ret, str);
	} else {
		/* Otherwise, duplicate the string whilst performing
		 * the replacements using the position cache. */
		pret = ret;
		memcpy(pret, str, pos_cache[0]);
		pret += pos_cache[0];
		for (i = 0; i < count; i++) {
			memcpy(pret, to, tolen);
			pret += tolen;
			pstr = str + pos_cache[i] + fromlen;
			cpylen = (i == count-1 ? orglen : pos_cache[i+1]) - pos_cache[i] - fromlen;
			memcpy(pret, pstr, cpylen);
			pret += cpylen;
		}
		ret[retlen] = '\0';
	}

end_repl_str:
	/* Free the cache and return the post-replacement string,
	 * which will be NULL in the event of an error. */
	free(pos_cache);
	return ret;
}


static char *
get_json_value(cJSON *json, const char *key)
{

	cJSON *val = cJSON_GetObjectItemCaseSensitive(json, key);
	char *out = NULL;

	if(!cJSON_IsInvalid(val) && !cJSON_IsNull(val)){
		if(cJSON_IsNumber(val)){
			int out_s = snprintf(NULL, 0, "%d",val->valueint)+1;
			out = malloc(out_s);
			snprintf(out, out_s, "%d", val->valueint);
		} else if (cJSON_IsString(val) && val->valuestring != NULL){
			int out_s = snprintf(NULL, 0, "%s", val->valuestring)+1;
			out = malloc(out_s + 1);
			snprintf(out, out_s, "%s", val->valuestring);
		}
	}
	
	return out;
}

cJSON *
get_json_path(cJSON *json, char *path)
{
	char delim[] = ".";
    char *tok = strtok(path, delim);

	cJSON * cur = json;

    while (tok && cur) {
		cur = cJSON_GetObjectItemCaseSensitive(cur, tok);
        tok = strtok(NULL, delim);
    }

	return cur;
}
