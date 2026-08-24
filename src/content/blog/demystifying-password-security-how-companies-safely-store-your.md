---
title: 'Demystifying Password Security: How Companies Safely Store Your Passwords'
description: 'Ever wondered how your passwords are stored by the websites you sign-up in? Lets imagine you recently found a wonderful clothing brand which is very underrated and affordable as...'
pubDate: 2024-06-29
source: hashnode
canonicalUrl: 'https://priyanshucodes.hashnode.dev/demystifying-password-security-how-companies-safely-store-your-passwords-c31e169f7e22'
# Imported. Read it through, fix the conversion, then set draft: false.
draft: true
---

Ever wondered how your passwords are stored by the websites you sign-up in?

Lets imagine you recently found a wonderful clothing brand which is very underrated and affordable as well and you wanna sign-up for future promotions and orders that you are gonna place in that particular website.

After all if you don’t sign-up they will never get to know who placed an order for what kind of product and where to deliver.

So you start the process of creating an account which requires you creating a password as well, the website stores it just like that in its database. If someone gets access to the database, they can see everyone’s password and potentially tamper with your data stored in the database which is a big OOPSIE!!.

So instead of storing your password as it is, the website uses a special function called a **hash function**. It’s like a small machine which takes your password and gives a blended version of the password which doesn’t looks like your password at all.

When you create or change your password, the website takes it, puts the password through this magical blender machine and gets a jumbled up result. This result is your **hashed password.**

Now here is the cool part: Once your password is hashed its almost near to impossible to got back or figure out the original password. It’s a one way street.

Even if the hacker gains access to the hashed passwords, it is extremely difficult and time consuming for them to reverse the process and obtain the original password.

The website then stores not your actual password but this hashed password that our magic blender gave, this basically means that **even the website/organisation doesn’t knows what you password is so when you forget the password they force you to change your password.**

To enhance security, a unique and random value called a **“salt”** is added to each password before hashing.

The salt ensures that even if two users have the same password, their hashed values will be different because of the unique salt.

## Procedure:

-   When a user creates an account or changes their password, the system generates a random salt for that user.
-   The system combines the user’s password and the random generated salt value and on applying the hash function to produce the hashed password.
-   The hashed password and the salt is then stored in the database.

## Now you may have a question, how is our password verified?

-   When a user attempts to log in, the system retrieves the salt value associated to the user from the database.
-   The system combines the entered password with the retrieved salt and then applies the same hash function.
-   It compares the computed hash value and the already stored hash, if they match, the entered password is correct.

The security practises may vary from company to company and not all websites implement the same measures.

Some systems use **“Pepper”**, which is a secret and random value that is combined with the password before hashing. Unlike a salt (which is unique per user), a pepper is common to all passwords in the system. It’s typically stored separately from the database.

To wrap up, knowing how companies keep your passwords safe is key to protecting your online identity. Methods like hashing with salts and peppers add extra security layers to databases. While these help, staying alert and using strong passwords is also important. By being mindful of security measures and how we manage our passwords, we all play a part in making the internet a safer place for everyone.
