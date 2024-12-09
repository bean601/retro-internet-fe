# This project is a React frontend to https://github.com/bean601/retro-internet
The idea is that given a url, we can pull up what it looked like in the 90's/early 2000's. See the back-end retro-internet project for more details.
There is a mapping file in the backend that ties a certain Archive.org snapshot of a page to the root domain that a user would expect. (eg. Yahoo.com = https://web.archive.org/web/19980705025730/).

The backend pulls this snapshot html from Archive.org, rewrites the html and image tags so hover overs look correct, then returns it. It does some caching of all the rewritten values so when it 
recieves a request for that src/link, it knows where to pull from in the snapshot.

This was never meant to be a web front end, the original intent was to run a Raspberry Pi to the NIC on my 1998 IBM Aptiva E series for surfing a period correct internet. It worked great!

# NOTE: This and the backend project are only meant as an education experiment. Please consider donating to Archive.org.
