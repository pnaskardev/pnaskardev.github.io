---
title: 'What is re-CAPTCHA and why is it used'
description: 'In this day and age where around 60% of the world is using internet, it is actually very safe to assume that we all have come across a very annoying prompt which asks us “Humans”...'
pubDate: 2024-12-30
source: hashnode
canonicalUrl: 'https://priyanshucodes.hashnode.dev/what-is-re-captcha-and-why-is-it-used-c67e46e24119'
# Imported. Read it through, fix the conversion, then set draft: false.
draft: true
---

In this day and age where around 60% of the world is using internet, it is actually very safe to assume that we all have come across a very annoying prompt which asks us “Humans” to prove that we are “Humans” which as I said is very annoying and may seem very stupid but at the same time it is seen on every website that we visit.

In this article I will try to answer the question “Why is re-CAPTCHA everywhere even though to a normal person it seems pretty stupid”. So lets get to answer that.

Lets get started with Why is re-CAPTCHA needed?

## Why is re-CAPTCHA needed?

We all know of electronic mails or E-Mail in short, back in the day when it was introduced every one on the internet started using it and it became one of the primary advertisement modes. This led to people using programmes create millions of free email accounts that they then used to send millions of spam emails to people which were basically spam/scam emails.

Big tech giants of that time like Yahoo(They used to rule the internet back then) were unable to solve the problem.

Now comes a genius named [**Luis Von Ahn**](https://www.linkedin.com/in/luis-von-ahn-duolingo/) who is a mathematical professor, computer engineer, academic research and genius grant award winner.

Luis worked out that the key to solve this problem is to distinguish between a real human who is going to set up an email account and a robot (which is going to create an email address and send spam emails to everyone).

At that time computers were pretty bad in reading obfuscated or distorted letters/numbers, but humans could. So he created a little test that would generate an image of distorted letters/numbers and ask the humans to enter them.

AAANNNDDDDD….. Eureka!!! CAPTCHA was born.

![](/blog/what-is-re-captcha-and-why-is-it-used/01.png)

Naively, Luis emailed Yahoo about his solution to the problem and explained it to him.

Yahoo said thanks and integrated the solution and their problem was gone but Luis never received any money whatsoever.

Luis continued his PhD and created an online game named ESP which showed you a picture and asked you to guess what words other people has typed for the same picture.

But behind the scenes this wasn’t a game at all rather it was much more complicated, he was crowd-sourcing the image tags. When two people typed the same thing the system tagged that image. Luis later sold this ESP to Google for real money this time.

One major downside of CAPTCHA was wasting a lot of human time. Even when Luis wasn’t thinking about that he was quickly reminded by someone of how annoying it was.

Around the same time Google announced that they wanted to digitise all the world books. They were literally scanning millions of books in dozens of languages. One problem was that the computer could not recognise 30–40% of the letters due to distorted images.

and here our mathematical genius came to rescue us and made re-CAPTCHA.

Now every time you had to prove that you weren’t a robot, instead of random letters you were choosing random letters from the books, when 10 or more people provided the same answer for the same image it went to the database allowing the computer to accurately transcribe the distorted letter.

In short you were training an AI bot to identify distorted letters.

re-CAPTCHA grew quickly and was adopted by tech giants very quickly.

Google later acquired re-CAPTCHA as well.

## Types of CAPTCHA tests —

\- Image Recognition  
\- Checkbox  
\- General user behaviour assessment (no user interaction at all)

## How does an image recognition Re-CAPTCHA work?

For an image recognition re-CAPTCHA test, typically users are presented with 9–16 square images. A user has to identify the images that contain certain objects, such as animals, trees or street signs. If their responses match with the responses submitted by mist of the other users who have submitted the same test, the answer is considered correct and the user passes the test

## How do reCAPTCHA tests with single checkbox work?

![](/blog/what-is-re-captcha-and-why-is-it-used/02.png)

Some tests prompt the user to check a box next statement “I’m not a robot.” It is an attempt to make re-CAPTCHA simple and less annoying however behind the scenes the test is not actual action of clicking the checkbox — it is everything leading up to the checkbox click.

This re-CAPTCHA test takes into the account the movement of the user’s cursor as it approaches the checkbox. Even the most direct motion by a human has some amount of randomness on the microscopic level, small unconscious movements that bots can’t easily mimic. If the test contains some level of unpredictability then we can say that the user is probably a real human and not an AI bot.

The re-CAPTCHA also may also assess the cookies stored by the browser on a user’s device and the history of device in order to tell if the user is likely to be a bot.

## How does a re-CAPTCHA test work without any user interaction?

The latest versions of re-CAPTCHA takes in a holistic look at a user’s behaviour and history of interacting with the content on the internet. Most of the time the program can decide based on these factors if the the user is a bot or not, without providing the user with a challenge to complete.

## Are CAPTCHAs enough for stopping malicious bots in this day and age?

Some bots can get past the text CAPTCHAs on their own. Researchers have demonstrated ways to write a program that beats the image recognition CAPTCHAs as well. In addition, attackers can use click farms to beat the tests: thousands of low-paid workers solving CAPTCHAs on behalf of bots.
