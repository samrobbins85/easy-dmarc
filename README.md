# Easy DMARC
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/samrobbins85/easy-dmarc?style=for-the-badge)

## About
This application sets up DMARC on your Vercel domains, and in the process also sets up SPF. In combination, these secure your domain by protecting you from fraud as it is much more difficult for people to send emails pretending to be your domain.

## How it works
You log in to Vercel, and it uses the token generated from this to list your domains. You select a domain and fill out the form to specify the options you want and click submit and then two generated DNS records will be added to your domain on Vercel, these are all that is needed for DMARC and SPF.


## Tech Stack Used
Next.js, React, Vercel API, Tailwind CSS, Vercel Hosting

## How to use it
This application is hosted at dmarc.vercel.app

For local development first clone the repository using
```shell
git clone https://github.com/samrobbins85/easy-dmarc.git
```

Then move into the directory and run
```shell
npm install
```
to install it, then
```shell
npm run dev
```
to start the dev server. The application can then be found at localhost:3000

## License
This project is licensed under MIT
