# Flask and create-react-app

## Requirements

1. `npm install`
2. `pip install -r requirements.txt`

## Setup

    Clone the code repository
    git clone https://github.com/NJIT-CS490-SP21/project1-tn224.git

    Install required Python packages
    pip install -r requirements.txt

    Run "echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local" in the project directory

## Run Application

1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku

1. heroku create --buildpack heroku/python
2. heroku buildpacks:add --index 1 heroku/nodejs
3. git push heroku {your_branch_name}:main
4. heroku addons:create heroku-postgresql:hobby-dev
5. Run heroku config in terminal and see the value for DATABASE_URL in the output. Copy paste that value (looks like 'postgress://...').
6. Create a .env file and add set our var DATABASE_URL. Run touch .env && echo "DATABASE_URL='copy-paste-database-url-here'" > .env.
7. Start your app (python app.py, npm run start in other terminal).
8. Open 2 new tabs with console open.

## Check it out here - Sample heroku web app

https://floating-thicket-90560.herokuapp.com

## Future Features

- Prevent user from logging in if username input is empty. I will do conditional checking in the onClick function for the Login Button and have an alert displayed on the screen if the input is empty
- Implement a history of moves so for all users to see. I will have another state variable in either Board.js or App.js to keep track of past moves and use socket to update the list across all users.
- Have an alert displayed out in the screen when an user attempts a move but it is not their turn. This feature can be implemented by having the backend doing the validation and emit an event to only the triggered browser with the attempted user. In the backend, one property in the even should be eliminated: broadcast=True.

## Technical Issues
- I had an error when I tried to install yapf. What I did was that I upgraded my pip and source the .bash_profil with the wrong path for my new pip. </br>
The error message was: </br>
  
```
$ export PATH=$HOME/usr/local/bin/pip
vocstartsoft:~/environment/classese-work/react-starter $ source ~/.bash_profile
bash: git: command not found
/home/linuxbrew/.linuxbrew/bin/brew: line 16: readlink: command not found
/home/linuxbrew/.linuxbrew/bin/brew: line 17: dirname: command not found
/home/linuxbrew/.linuxbrew/bin/brew: line 113: /home/linuxbrew/.linuxbrew/Library/Homebrew/brew.sh: No such file or directory </br>
bash: uname: command not found
bash: ps: command not found 
```

How I solved it: </br>
I followed [a stackoverflow's similar post](https://stackoverflow.com/a/21499850/15218088) </br>
Run in console the commands: </br>
```
  export PATH=/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin`
  source ~/.bash_profile`
```
- When I used eslint to clean my js files, I configured it to override the `react/jsx-filename-extension` rule. However I got this error: </br>

```
npx eslint src/App.js 

Oops! Something went wrong! :(

ESLint: 7.22.0

Failed to read JSON file at /home/ec2-user/environment/classese-work/react-starter/.eslintrc.json:

Cannot read config file: /home/ec2-user/environment/classese-work/react-starter/.eslintrc.json
Error: Unexpected token } in JSON at position 178
```
What happened was that I had an extra comma in my json file that resulted in this error. I deleted it and it works fine now </br>

- When I did a unit test for my Log in Button component in the UI, I got the error: ` TypeError: expect(...).toBeInTheDocument is not a function`. </br>
The error was because toBeInTheDocument is not part of react-testing-library. I need to install jest-dom to enable it. </br>
How I solved it: </br>
I followed [a stackoverflow's similar post](https://stackoverflow.com/questions/56547215/react-testing-library-why-is-tobeinthedocument-not-a-function) </br>
I added this line to my App.test.js file to include the jest-dom:
`import '@testing-library/jest-dom'`