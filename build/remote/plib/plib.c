#include "plib.h"
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// clang-format off
#define print(a, ...) print_imp(__TIME__, __FILE__, __LINE__, __func__, a, __VA_ARGS__)
void print_imp(const char *time, const char *file, const int line, const char *func, const char *format, ...) {
  if (PL_VERBOSE) {va_list args;
    va_start(args, format);
    printf("%s (%s@%d) %s: ", time, file, line, func);
    vprintf(format, args);
    va_end(args);
  }
}
// clang-format on

// read plib.h docs
int PL_MEM_USE = 1;
node PL_ARGS;
int PL_ARG_LAST_INDEX = -1;
int PL_ARGC;
char **PL_ARGV;
char PL_SPLITCHAR = '=';
char *PL_LAST_ARG;
int PL_ARG_NOT_FOUND_ERROR = 1;

/**
 * @brief allocates string to PL_LAST_ARG
 * plib keeps track of the last parsed arg by allocating
 * memory for it in the PL_LAST_ARG value, this function
 * will just take in a string and correctly allocate it
 * to PL_LAST_ARG.
 **/
pl_r alloc_last_arg(const char *arg);

/**
 * @brief splits a string at a certain char
 *
 * This function is used to split arguments by
 * a char. for example taking in the key and val pointer
 * and parsing in a value like `--key=val` it would allocate
 * key and val to hold the values split at whatever char `s`
 * is, in the example if '=' was `s` then the returned values
 * would be `--key` and `val`.
 **/
int split_arg(char **key, char **val, char *in, char s);

/**
 * @brief custom malloc to track mem use
 **/
void *MALLOC(size_t in);

/**
 * @brief custom realloc to track mem use
 **/
void *REALLOC(void *in, size_t new, size_t old);

/**
 * @brief custom free to track mem use
 **/
void FREE(void *in, size_t size);

void *MALLOC(size_t in) {
  PL_MEM_USE += in;
  // print("pl memory changed to %d (+%d)\n", PL_MEM_USE, in);
  return malloc(in);
}

void *REALLOC(void *in, size_t new, size_t old) {
  PL_MEM_USE -= old;
  // print("pl memory changed to %d (-%lu)\n", PL_MEM_USE, old);
  PL_MEM_USE += new;
  // print("pl memory changed to %d (+%lu)\n", PL_MEM_USE, new);
  return realloc(in, new);
}

void FREE(void *in, size_t size) {
  if (in == NULL)
    return;
  PL_MEM_USE -= size;
  // print("pl memory changed to %d (-%lu)\n", PL_MEM_USE, sizeof(in));
  free(in);
}

int split_arg(char **key, char **val, char *in, char s) {
  int part_val = 0;
  int part_key = 0;
  *key = MALLOC(strlen(in) * sizeof(char) + 1);
  *val = NULL;

  for (size_t i = 0; i < strlen(in); i++) {

    // flip the part if =
    if (in[i] == s && part_val == 0) {
      part_val = i;
      *val = MALLOC(strlen(in) * sizeof(char) + 1);
      continue;
    }

    // assign key
    if (part_val == 0) {
      (*key)[i] = in[i];
      part_key++;
      // assign value
    } else
      (*val)[i - part_val - 1] = in[i];
  }

  // end strings and return
  (*key)[part_key] = '\0';

  if (part_val)
    (*val)[strlen(in) - part_val - 1] = '\0';

  return 0;
}

int pl_arg_exist(node **buf, const char *name) {
  *buf = &PL_ARGS;
  int idx;
	
	// loop through all nodes recursivly
  while ((*buf)->init == 1) {

		// if the node has values 
    if (name != NULL && (*buf)->init == 1) {

			// if the node has a match to the flag 
      if ((*buf)->arg.flag != NULL && strcmp((*buf)->arg.flag, name) == 0) {
        print("node found at index %d\n", idx);
        return PL_SUCCESS;

			// or if the node has a match to the short_flag
      } else if ((*buf)->arg.short_flag != NULL &&
          strcmp((*buf)->arg.short_flag, name) == 0) {
        print("node found at index %d using shorthand\n", idx);
        return PL_SUCCESS;
      }
    }

		// move to the next node
    *buf = (*buf)->next;
    idx++;
  }
	
	// searched through all nodes
  return PL_FAIL;
}

node *get_next_node(void) {
  node *cur = &PL_ARGS;
  int idx = 0;
  while (cur->init != 0) {
    cur = cur->next;
    idx++;
  }

  print("returning node at index %d\n", idx);

  return cur;
}

int get_next_node_i(void) {
  node *cur = &PL_ARGS;
  int recurse_count = 0;
  while (cur->init != 0) {
    cur = cur->next;
    recurse_count++;
  }
  printf("returning node at index %d\n", recurse_count);
  return recurse_count;
}

pl_arg *pl_a(pl_arg in) {
  node *cur;

  if (in.short_flag != NULL) {
    if (pl_arg_exist(&cur, in.short_flag) == PL_SUCCESS) {
      print("argument with this shorthand '%s' already defined.. skipping\n",
            in.short_flag);
      return (pl_arg *){0};
    }
  }

  if (pl_arg_exist(&cur, in.flag) == PL_SUCCESS) {
    printf("argument with this flag '%s' already defined.. skipping\n",
           in.flag);
    return (pl_arg *){0};
  }

  cur = get_next_node();

  cur->init = 1;
  cur->arg = in;
  cur->arg._value.capacity = 2;
  cur->arg._value.index = 0;
  cur->arg._short_run = 0;
  if (cur->arg.takes_value) {
    cur->arg._value.array = MALLOC(sizeof(char *) * 2);
    print("allocated %lu bytes for new value array\n", sizeof(char *) * 2);
  }

  if (cur->arg.cat == NULL)
    cur->arg.cat = "Options";

  int node_size = sizeof(node);
  cur->next = MALLOC(node_size);
  print("allocated %lu bytes for new node\n", node_size);
  return &cur->arg;
}

pl_r alloc_last_arg(const char *arg) {
  if (arg == NULL)
    return PL_FAIL;

  size_t arg_size = strlen(arg);
  size_t old_size = strlen(PL_LAST_ARG) * sizeof(char);

  PL_LAST_ARG = NULL;
  char *tmp = REALLOC(PL_LAST_ARG, arg_size * sizeof(char), old_size);
  if (!tmp) {
    print("Error in realloc%s\n", "");
    return PL_MEM_ALLOC_ERROR;
  }

  PL_LAST_ARG = tmp;
  strcpy(PL_LAST_ARG, arg);

  return PL_SUCCESS;
}

pl_r pl_proc(const int c, char *v[]) {
  if (c <= 1)
    return PL_NO_ARGS_GIVEN;

  int return_code = PL_SUCCESS;

  // set locals
  PL_ARGV = v;
  PL_ARGC = c;

  PL_LAST_ARG = MALLOC(32);

  for (int i = 1; i < c; i++) {
    PL_ARG_LAST_INDEX = i;

    char *arg = v[i];
    char *key, *val = NULL;

    if (alloc_last_arg(v[i]) == PL_MEM_ALLOC_ERROR) {
      print("last arg alloc failed%s\n", "");
      return PL_MEM_ALLOC_ERROR;
    }

    split_arg(&key, &val, arg, PL_SPLITCHAR);

    node *arg_node = NULL;
    if (pl_arg_exist(&arg_node, key) == PL_SUCCESS && arg_node != NULL &&
        arg_node->init == 1) {

      // check if arg needs value
      if (arg_node->arg.takes_value == 1 && val == NULL) {
        return_code = PL_ARG_REQUIRES_VALUE;

        // check if arg does not need value
      } else if (arg_node->arg.takes_value == 0 && val != NULL) {
        return_code = PL_ARG_NO_REQUIRE_VALUE;

      } else {

        // check if argument was shorthand
        if (arg_node->arg.short_flag != NULL)
          if (strcmp(key, arg_node->arg.short_flag) == 0)
            arg_node->arg._short_run++;

        // handle value dma
        if (arg_node->arg.takes_value == 1) {
          struct dma *value = &arg_node->arg._value;

          // dma
          if (value->index == value->capacity) {
            value->capacity *= 2;
            char **tmp =
                realloc(value->array, value->capacity * sizeof(char *));
            if (!tmp) {
              return_code = PL_MEM_ALLOC_ERROR;
              FREE(value->array, value->index * sizeof(char *));
              break;
            }
            value->array = tmp;
          }

          value->array[value->index] = MALLOC(sizeof(val));
          strcpy(value->array[value->index], val);
          value->index++;
          // increment for non-value-taking args
        } else
          arg_node->arg._value.index++;
      }
    } else if (PL_ARG_NOT_FOUND_ERROR) {
      return_code = PL_ARG_NOT_FOUND;
    }

    FREE(key, strlen(key));

    if (val != NULL)
      FREE(val, strlen(val));
    else
      FREE(val, 0);
    if (return_code != PL_SUCCESS)

      break;
  }

  if (return_code == PL_SUCCESS) {

    // check all required args where run
    node *cur = &PL_ARGS;
    while (cur->init == 1) {
      alloc_last_arg(cur->arg.flag);
      if (cur->arg.required == 1 && cur->arg._value.index <= 0) {
        return PL_ARG_REQUIRED;
      }

      cur = cur->next;
    }
  }

  return return_code;
}

void pl_free() {
  node *cur = &PL_ARGS;
  int rec_lev = 0;

  while (cur != NULL) {
    print("starting de-alloc on node index %d\n", rec_lev);
    node *next = cur->next;

    if (cur->arg.takes_value && cur->arg._value.array != NULL) {
      for (int i = 0; i < cur->arg._value.index; i++) {
        if (cur->arg._value.array[i] != NULL) {
          size_t val_size = strlen(cur->arg._value.array[i]) + 1;
          print("free'd %lu bytes of mem for value[%d]\n", val_size, i);
          FREE(cur->arg._value.array[i], val_size * sizeof(char));
          cur->arg._value.array[i] = NULL;
        }
      }

      print("free'd %lu bytes of mem for value array\n",
            cur->arg._value.capacity * sizeof(char *));

      FREE(cur->arg._value.array, cur->arg._value.capacity * sizeof(char *));

      cur->arg._value.array = NULL;
    }
    if (cur != &PL_ARGS) {
      print("free'd %lu bytes of mem for node\n", sizeof(node));
      FREE(cur, sizeof(node));
    }
    cur = next;
    rec_lev++;
  }

  size_t last_arg_size = 0;

  if (PL_LAST_ARG != NULL) {
    last_arg_size = strlen(PL_LAST_ARG) * sizeof(char);
  }

  FREE(PL_LAST_ARG, last_arg_size);

  print("exiting plib with %d bytes of memory held\n", PL_MEM_USE);
}

// get the value at an index
char *pl_get_value(const pl_arg *arg, const int i) {
  print("retrieving value of arg %s at index %d\n", arg->flag, i);
  if (PL_R(arg)) {
    if (i > arg->_value.index)
      return NULL;
    return arg->_value.array[i];
  } else
    return NULL;
}

void rep(const int l, const char c) {
  if (l == 0)
    return;
  for (int i = 0; i < l; i++)
    putchar(c);
}

int in(const char *in, char **arr, const size_t size) {
  print("searching for %s in array with size of %d\n", in, size);

  if (arr == NULL || in == NULL || size < 0)
    return 0;

  for (int i = 0; i < size; i++) {
    if (strcmp(in, arr[i]) == 0)
      return 1;
  }

  return 0;
}

// kitty mreeop :3
void pl_help_print_cat(const char *cat) {
  node *cur = &PL_ARGS;
  size_t l_flag = 0, l_type = 0, l_short = 0;
  const int padding = strlen(PL_HELP_SEP);

  // loop through and get longest values
  while (cur->init == 1) {
    pl_arg a = cur->arg;

    if (a.flag != NULL && strlen(a.flag) > l_flag)
      l_flag = strlen(a.flag);

    if (a.type != NULL && strlen(a.type) > l_type)
      l_type = strlen(a.type);

    if (a.short_flag != NULL && strlen(a.short_flag) > l_short)
      l_short = strlen(a.short_flag);

    cur = cur->next;
  }

  // print the hint column
  if (PL_HELP_HINT_COL) {
    printf("%sarg,", PL_HELP_SEP_ANSI);
    if (l_short != 0)
      printf("short arg,");

    printf("value,");

    if (l_type != 0)
      printf("takes value of type,");
    printf("description\033[0m");

    putchar('\n');
  }

  // reset the cur object
  cur = &PL_ARGS;

  // print the category name
  printf("\033[1m%s%s:\033[0m\n", cat, PL_HELP_SEP_ANSI);

  // loop through each node
  while (cur->init == 1) {

    // skip if the arg dosent have the current category
    if (strcmp(cur->arg.cat, cat) != 0) {

      // recurse to the next node
      cur = cur->next;
      continue;
    }

    pl_arg arg = cur->arg;

    // indent the argument
    rep(PL_HELP_CAT_INDENT, ' ');

    // print the argument name
    printf("%s%s\033[0m", PL_HELP_SEL_ANSI, arg.flag);

    // print required indicator
    if (arg.required)
      printf("*\033[0m");
    else
      printf(" ");

    rep(l_flag - strlen(arg.flag), ' ');

    // if at least one argument has a shorthand
    if (l_short != 0) {

      // if the current argument has a shorthand
      if (arg.short_flag != NULL) {
        printf("%s%s%s%s\033[0m", PL_HELP_SEP_ANSI, PL_HELP_SEP,
               PL_HELP_SEL_ANSI, arg.short_flag);
        rep(l_short - strlen(arg.short_flag), ' ');
      } else {
        // if not then print some filler space
        printf("%s%s", PL_HELP_SEP_ANSI, PL_HELP_SEP);
        rep(l_short, ' ');
      }
    }

    // if at least one argument has a type
    if (l_type != 0) {

      // print takes-value indicator
      if (arg.takes_value)
        printf("%s%s\033[0m value of", PL_HELP_SEP_ANSI, PL_HELP_SEP);
      else
        printf("%s%s\033[0m no value", PL_HELP_SEP_ANSI, PL_HELP_SEP);

      // if the current arg has a type
      if (arg.type != NULL) {
        printf("%s%s%s%s", PL_HELP_SEP_ANSI, PL_HELP_SEP, PL_HELP_SEL_ANSI,
               arg.type);
        rep(l_type - strlen(arg.type), ' ');
      } else
        // or if not print some space
        printf("%s", PL_HELP_SEP);
      rep(l_type, ' ');
    }

    // print the description
    printf("%s%s\033[0m%s\n", PL_HELP_SEP_ANSI, PL_HELP_SEP, arg.desc);

    // recurse to the next node
    cur = cur->next;
  }
}

void pl_help() {
  node *cur = &PL_ARGS;

  int cat_idx = 0;
  int cat_cap = 2;
  char **cats = MALLOC(cat_cap * sizeof(char *));

  // pre-run
  while (cur->init == 1) {
    pl_arg a = cur->arg;

    if (!in(a.cat, cats, cat_idx)) {

      if (cat_idx == cat_cap) {
        cat_cap *= 2;
        char **tmp = REALLOC(cats, cat_cap * sizeof(char *),
                             (cat_cap / 2) * sizeof(char *));
        if (!tmp) {
          return;
        }

        cats = tmp;

        if (!cats) {
          printf("error in mem alloc\n");
        }
      }

      cats[cat_idx] = a.cat;
      cat_idx++;
    }

    cur = cur->next;
  }

  for (int i = 0; i < cat_idx; i++) {
    pl_help_print_cat(cats[i]);
    printf("\n");
  }

  FREE(cats, cat_idx * sizeof(char *));
}
