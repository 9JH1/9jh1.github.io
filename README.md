# Welcome to my websites source code!
> [Visit the website in question here!](https://9jh1.github.io)
```
If you're here, you're here for one of two reasons:
1. you came from my repos and you want to see my website.. look up!
2. you came from my website and you're wanting to know more about it.
```
---
## The 2nd option..
```
If you're still reading you must be intested in how my website was made or how it functions.. First
and foremost my website has been about performance from the very start. I needed a simple and basic
page that fit my needs exactly, luckily I'm a huge fan of retro-style websites and the basic page
with monospaced font is a perfect match.

My website uses a behind the scenes json file containing every project and journal entry available on 
my page. Along with this is a skeleton page containg all the html excluding the projects and journal.
I wrote a C program that goes line by line of my page searching for the text `PROJECT_START` or 
`JOURNAL_START` when this keyword is found, its repsective data is loaded from the backend json file.
this data along with each line of the original html file is all printed to stdout. 

My program is rather 
basic but the performance increase is incredible. Ok now hear me out when I used a javascript loader to 
parse the json file every time a user reloads the page it would load in roughly ~5ms to ~3ms with an 
occasional outlier showing sub 2ms times. now that all that loading is done as a preprocess the page 
loads at sub 1ms average. Along with preprocessing I took great attention to detail on minimizing the 
amount of styles used on the page.

The final file size generated is roughly 8.4 Kilobytes which nicely fits into the 14.6 Kilobytes 
sent over TCP's slow start algorithm.
```
