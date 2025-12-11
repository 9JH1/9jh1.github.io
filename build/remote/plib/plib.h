/** 
 * @file plib.h
 * @brief argument parsing library
 * 
 * PLib.h is an extensive argument parsing library written in C. 
 * To use plib import it into your project and define an argument. 
 * an argument can have many different properties that change how 
 * the parsing engine interacts with them.
 * 
 * Heres a quickstart:
 * @code 
 * #include <stdio.h>
 * #include "plib.h" 
 * 
 * int main(int argc, char *argv[]){
 *   pl_arg *help = PL_A("--help");
 *   
 *   if(PL_PROC()){
 *     // no errors occured while parsing  
 *     
 *     if(PL_R(help)){
 *       printf("--help run!\n");
 *     }
 *   }
 * 
 *  return 0;
 * }
 * @endcode 
 *
 * Running the above will produce an output of `--help run!` when then 
 * program is run with the `--help` flag. Please read @ref pl_arg for 
 * all of the possible options that can be added. 
 *
 * Plib keeps track of all arguments in a recursion-node table. This 
 * form of data storage does not require reallocation which is why 
 * this was perfered over an older use of a structure array. For 
 * ever argument created there is a corrosponding node. A node is 
 * just a structure that can have different properties applyed to it 
 * for example a property in this case would be a pl_arg structure 
 * containing the nodes argument data. Another property of a node is 
 * the .next property this property is a space that can hold another  
 * node, you can think of this as a directory inside a directory. To 
 * read all of the other possible node values read the @ref node
 * struct.
 * @code 
 * node1 
 * - pl_arg 
 *   - ..arg values.. 
 * - node2 
 *   - pl_arg 
 *     - ..arg values..
 *   - node3 
 *     - pl_arg 
 *       - ..arg values.. 
 *     - node4 
 *       - pl_arg 
 *         - ..arg values..
 * ... 
 * @endcode
 * Note that node1 would be the same as PL_ARGS.
 * 
 * To elaborate on why this method is used over a struct array is 
 * due to how memory pointers in C work. Now in older versions of 
 * PLib I used a struct array. the PL_A function would return a 
 * pointer to the pl_arg inside an array of other pl_args. now the 
 * issue with this is that at some point the pl_arg array has to be 
 * reallocated due to its dynamic memory behavior made to hold more 
 * arguments, this occures after the second argument call as that 
 * is the default capacity. When this reallocation occures the old 
 * memory pointer will be invalidated and will turn into a dangling 
 * pointer.
 *
 * Plib is amoung many when it comes to basic argument parsing librarys.
 * This library includes @ref pl_help which is a modern help menu that 
 * displays all of the arguments defined in a dynamic catagorized table 
 * form. PLib also includes a extensive debug mode when compiled with 
 * `-DPL_VERBOSE`. Along with this error checking is simple as: 
 * @code
 * // get return code from parser 
 * pl_r return_code = PL_PROC();
 * 
 * // catch error
 * if(return_code != PL_SUCCESS){
 *   printf("Error %s occured from argument %s (%d)\n",
 *     PL_E(return_code), // stringify error code 
 *     PL_LAST_ARG,       // get last argument parsed 
 *     return_code);      // print error code number 
 *
 *	 pl_help();           // call help menu 	
 *   return 1;
 * }
 * @endcode 
 * this simple statement will call @ref pl_help and show the error code 
 * as a string along with the last argument parsed by plib (this would be 
 * the argument that caused the error). If you want to do this with PLib 
 * you can call @ref PL_E_INFO which will print out a similar statement.
 **/ 
#ifndef PLIB
#define PLIB 

// verbose flag checking
#ifdef PL_VERBOSE 
#define PL_VERBOSE 1
#else 
#define PL_VERBOSE 0
#endif

/** 
 * @brief amount of spaces indented on items in help menu 
 **/
#define PL_HELP_CAT_INDENT 2


/** 
* @brief sets the ansi color of the seperator in the help menu 
**/ 
#define PL_HELP_SEP_ANSI "\033[38m"

/** 
 * @brief sets the highlight color of the text in the help menu 
 **/
#define PL_HELP_SEL_ANSI "\033[31m"

/** 
 * @brief help menu seperator string 
 **/
#define PL_HELP_SEP " | "

/** 
 * @brief print the format specifier at the top of help menu calls 
 * 
 * set to zero to disable 
 **/ 
#define PL_HELP_HINT_COL 0


/**
 * @brief return codes of various functions 
 * @see pl_s 
 **/ 
typedef enum {
  PL_NO_ARGS_GIVEN = -1,
  PL_NO_ARGS_DEFINED = -2,
  PL_SUCCESS = -3,
  PL_FAIL = -4,
  PL_ARG_NOT_FOUND = -5,
  PL_ARG_REQUIRES_VALUE = -6,
  PL_ARG_NO_REQUIRE_VALUE = -7,
  PL_MEM_ALLOC_ERROR = -8,
	PL_ARG_REQUIRED = -9,
} pl_r;

/** 
 * @brief takes a negative below zero number and converts it to an array friendly number
 * 
 * used for translating the negative return codes from pl_r into valid array indexes for 
 * pl_s.
 *
 * note that this macro is un-defined later
 **/
#define _I(n) ((n+1)*-1)

/** 
 * @brief stringifyed versions of return codes 
 **/
static const char *pl_s[9] = {
	[_I(PL_NO_ARGS_GIVEN)] = "NO_ARGS_GIVEN",
	[_I(PL_NO_ARGS_DEFINED)] = "NO_ARGS_DEFINED",
	[_I(PL_SUCCESS)] = "SUCCESS",
	[_I(PL_FAIL)] = "FAIL",
	[_I(PL_ARG_NOT_FOUND)] = "ARG_NOT_FOUND",
	[_I(PL_ARG_REQUIRES_VALUE)] = "ARG_REQUIRES_VALUE",
	[_I(PL_ARG_NO_REQUIRE_VALUE)] = "ARG_NO_REQUIRE_VALUE",
	[_I(PL_MEM_ALLOC_ERROR)] = "MEM_ALLOC_ERROR",
	[_I(PL_ARG_REQUIRED)] = "ARG_IS_REQUIRED",
};


/** 
 * @brief dma struct used in _value of pl_arg 
 * @param array Array of allocated strings 
 * @param capacity the amount of space allocated 
 * @param index the amount of items currently held
 **/ 
struct dma {
  char **array;
  int capacity;
  int index;
};





/**
 * @brief main struct for arguments 
 *
 * @param flag flag name eg `--help`, this is required
 * @param desc description of flag
 * @param cat catagory, defaults to `Options:`
 * @param type type of argument (can be anything) 
 * @param short_flag shorthand version of flag eg -h
 * @param takes_value does the arg take a value eg -v='123' or -v
 * @param  required throws an error if an argument with this flag was not run.
 **/
typedef struct {
  char *flag;
  char *desc;
  char *cat;

  // extra
  char *type;
  char *short_flag;

  // features
  int takes_value;
	int required;

  // metadata cannot be changed
  int _short_run;
  struct dma _value;
} pl_arg;


/**
 * @brief node structure 
 *
 * This is the structure that recursivly holds 
 * all of the arguments information, each node 
 * can have another node nested in it. This 
 * approach seems strange seeing as you could 
 * just use an array right? WRONG!! if you try 
 * to use an array and lets say this array is 
 * dynamically allocated and has a starting  
 * capacity of 2, if for example the @ref pl_a 
 * function returned the arguments memory 
 * pointer and then the array was reallocated 
 * then the address of the pointer is removed 
 * and therefore causes a dangling pointer, 
 * using nodes means that you do not need to 
 * reallocate to add a new item as you just 
 * need to allocate the space in the node with 
 * the highest recursive level.
 * 
 * @param arg pl_arg options 
 * @param recurse unused value 
 * @param skip, should the parser skip this node 
 * @param init has the current node been 
 *        initialized with a pl_arg?
 * @param next the next node in the table. 
 **/
typedef struct node {
  pl_arg arg;
  int recurse;
  int skip;
  int init;
  struct node *next;
} node;

/** 
 * @brief local copy of argc 
 **/ 
extern int PL_ARGC;

/** 
 * @brief node table holding pl_args 
 **/ 
extern node PL_ARGS;

/** 
 * @brief local copy of argv 
 **/ 
extern char **PL_ARGV;

extern int PL_MEM_USE;

/** 
 * @brief what character to split arguments at 
 * 
 * this is useful for many reasons for example 
 * if you wanted to use it normally it splits 
 * at the '=' char meaning --test=123 is interpreted 
 * as key: --test, val: 123, if you wanted to have cool 
 * arguments like gcc's -WMY_VALUE_HERE or -DMY_VALUE_HERE 
 * you can set up an argument with a flag name of '-' and 
 * change the splitchar to 'D' or 'W' you can parse 
 * -DMY_VALUE into key: -, val: MY_VALUE. you can dual parse 
 * both regular and alternative splutchars in unison like so: 
 * 
 * @code 
 * // ...
 * pl_arg *test1 = PL_A(.flag = "--test", "basic test arg",.takes_value=1);
 * // disable parser quit on arg not found
 * PL_ARG_NOT_FOUND_ERROR = 0; 
 *
 * pl_proc(c, argv);
 * if (PL_R(test1))
 *   for (int i = 0; i < test1->_value.index; i++)
 *     printf("value: %s\n", pl_get_value(test1, i));
 * 	
 * pl_arg *test2 = PL_A(.flag = "-", .takes_value = 1);
 * PL_SPLITCHAR = 'D';
 * pl_proc(c, argv);
 *
 * if (PL_R(test2))
 *   for (int i = 0; i < test2->_value.index; i++)
 *     printf("value: %s\n", pl_get_value(test2, i));
 * // ...
 * @endcode
 *
 * the above code will run the parser twice. Once to 
 * look for arguments that use the default '=' split 
 * and another to look for arguments with the splitchar 
 * of 'D' in order for this to work you have to disable 
 * the ARG_NOT_FOUND_ERROR because if you tryed parsing 
 * `-DMY_FLAG --test=123` it would fail as on the first 
 * run the parser would try to split -DMY_FLAG by an '=' 
 * when it dosent find it it will search for if the arg 
 * exists in the arg list in general and it most likely 
 * will not which will cause the parser to return a code 
 * of `PL_ARG_NOT_FOUND`. this can be disabled by setting 
 * the `PL_ARG_NOT_FOUND_ERROR` to 0 like shown in the 
 * above code. With `PL_ARG_NOT_FOUND_ERROR1 equal to 0 
 * the code passes through both loops regardless of if 
 * an argument is missing. So in short you can do dual 
 * parsing utilizing the PL_SPLITCHAR value but you will 
 * sacrafice being able to throw errors for missing 
 * arguments.
 **/
extern char PL_SPLITCHAR;
/** 
 * @brief last index of PL_ARGV that was parsed by plib 
 *
 * The last index of PL_ARGV  that was parsed by plib 
 * this will be useful in error detection as you can 
 * easily get the argument that got caused the error by 
 * getting PL_ARGV[PL_ARG_LAST_INDEX]; or use @ref PL_L.
 **/ 
extern int PL_ARG_LAST_INDEX;

/** 
 * @brief returns the last argument parsed by plib as a string 
 **/
#define PL_L() (PL_ARG_LAST_INDEX > 0) ? PL_ARGV[PL_ARG_LAST_INDEX] : "NO_LAST_ARGUMENT"

/** 
 * @brief disable the arg not found error 
 *
 * As seen in the @ref PL_SPLITCHAR description this value 
 * will disable @ref pl_proc return on arg not found error 
 * this is useful when running dual argument split chars as
 * pl wont stop parsing until EVERY argument has been either 
 * validated or not.
 *
 * @see PL_SPLITCHAR
 **/ 
extern int PL_ARG_NOT_FOUND_ERROR;

/** 
 * @brief frees allocated memory of nodes 
 *
 * this function is called on exit 
 * @see PL_PROC
 * @see node
 **/
void pl_free();

/**
 * @brief help menu 
 * 
 * @see PL_HELP_SEP_ANSI
 * @see PL_HELP_SEL_ANSI 
 * @see PL_HELP_CAT_INDENT
 **/
void pl_help(void);

/** 
 * @brief create an argument 
 *
 * adds an argument to PL_ARGS in the form 
 * of a node. read @pl_arg to see all of the options 
 *
 * @param in pl_arg struct to add to PL_ARGS
 *
 * @see get_next_node
 * @returns pointer to argument in PL_ARGS
 **/
pl_arg *pl_a(pl_arg in);

/** 
 * @brief gets the next available node 
 *
 * read @ref node and @ref pl_a 
 * when @ref pl_a is called this function is 
 * called, this function recurses through the 
 * node table until it finds a node that does n
 * not have its .init value set, the .arg value 
 * is then set to the *in and the init is toggled 
 * on.
 *
 * @returns pointer to next available node
 **/
node *get_next_node(void);

/** 
 * @brief get next node recurse level 
 * 
 * similar to @ref get_next_node this function
 * recurses until it finds an argument without the 
 * .init value set. the difference is that this 
 * function simply returns the amount of recurses 
 * required to get to the next free node.
 *
 * @returns recurse level of next available node 
 * @see get_next_node 
 **/
int get_next_node_i(void);

/**
 * @brief parses argc and argv 
 *
 * loops through arguments and splits them 
 * at the first @ref PL_SPLITCHAR char, then 
 * they are run through @ref pl_arg_exist to 
 * see if the argument exists or not. 
 *
 * @param c Count of arguments in v 
 * @param v array of strings
 * @see PL_PROC
 **/ 
int pl_proc(const int c, char *v[]);

/**
 * @brief wrapper for pl_proc 
 *
 * automatically takes in argv and argc, will cause 
 * errors if argc or argv are not defined.
 **/ 
#define PL_PROC() pl_proc(argc,argv)

/** 
 * @brief check if argument exists by its flag name 
 *
 * @param flag flag string to search for 
 * @param buf buffer that is equal to the last node 
 * 				parsed. when this function returns buf will 
 * 				be the argument in which the arg was found. 
 * 				be sure to check that the return code is 
 * 				PL_SUCCESS before accessing the buf value.
 **/
pl_r pl_arg_exist(node **buf, const char *flag);

/** 
 * @brief gets the value of an argument 
 *
 * arguments can have multiple values, these values 
 * are stored in a dynamically allocated array using 
 * the @ref dma struct. because there are multiple 
 * values this function takes in an index which returns 
 * that index of values. 
 *
 * if you only expect one argument then use 
 * @ref PL_G which returns the first item in an argument 
 *
 * use @ref pl_arg_value_count to get the total amount 
 * of arguments availble
 *
 * @param arg @ref pl_arg to get the value of
 * @param i index of value. (read above)
 *
 * @see pl_arg_value_count 
 * @see PL_G 
 **/
char *pl_get_value(const pl_arg *arg, const int i);

/** 
 * @brief gets the first value run on an arg 
 * @returns first value run with argument 
 * @param arg pl_arg to get value of
 * @see pl_get_value
 * @see pl_arg_value_count
 **/
#define PL_G(arg) pl_get_value(arg, arg->_value.index -1)

/** 
 * @brief get the amount of values an arg has 
 * @see PL_G 
 * @see pl_get_value
 **/
#define pl_arg_value_count(arg) (arg._value.index)

/** 
 * @brief macro wrapper for pl_a 
 *
 * removes the need to define the strcure type which 
 * changes the code from 
 * @code 
 * pl_arg * my_arg = pl_a((pl_arg){"--my-arg","description"});
 * //                      ^~~~~~ define the pl_arg struct 
 * @endcode 
 * to 
 * @code 
 * pl_arg * my_arg PL_A("--my-arg","description");
 * //                   ^ no structure name!
 * @endcode 
 * so much faster!
 * @see pl_a 
 **/
#define PL_A(...) pl_a((pl_arg){__VA_ARGS__})

/** 
 * @brief get the type of key arg was run with 
 * 
 * as mentioned in @ref pl_arg there can be a short 
 * hand argument added to a flag this is useful for 
 * arguments that may need shorter versions eg for a 
 * flag of `--help` you may want a shorthand of `-h`
 *
 * @see pl_arg 
 **/
#define PL_R(arg) (arg->_value.index > 0)

/** 
 * @brief returns a stringifyed version of an error code 
 * @see pl_s 
 * @see pl_r 
 **/ 
#define PL_E(ret) pl_s[_I(ret)]

/**
 * @brief gets the last argument parsed by plib 
 **/
//#define PL_LAST_ARG (PL_ARG_LAST_INDEX >= 0) ? PL_ARGV[PL_ARG_LAST_INDEX] : NULL
extern char * PL_LAST_ARG;

/**
 * @brief prints info about an error  using styled ansi 
 **/
#define PL_E_INFO(e) printf("Error %s%s\033[0m occured from argument %s%s %s(%d)\033[0m\n",PL_HELP_SEL_ANSI,PL_E(e),PL_HELP_SEL_ANSI,PL_LAST_ARG,PL_HELP_SEP_ANSI,e);
#endif // PLIB 
