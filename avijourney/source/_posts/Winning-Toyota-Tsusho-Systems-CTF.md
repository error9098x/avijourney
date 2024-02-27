---
title: "Wining Toyota Tsusho Systems CTF: A Journey in Problem-Solving and Teamwork"
date: 2024-02-27 21:34:00
tags:
  - CTF
  - Cybersecurity
  - Competition
categories:
  - [Journey]
---
Created: February 27, 2024 9:15 PM

Today, I'm thrilled to share with you our journey of participating in and winning the Toyota Tsusho Systems CTF. It was an exhilarating experience that tested our problem-solving skills, technical knowledge, and team synergy.

![Team Celebrating](https://cdn.gilcdn.com/ContentMediaGenericFiles/87be8015a1ecb7f793da17933b4c2baf-Full.webp?w=2048&h=1536)
*The moment we clinched the victory!*

## The Competition 🏆

CTF competitions are battles of cybersecurity skills involving challenges in web exploitation, cryptography, and reverse engineering. This CTF had a focus on Forensics, especially related to blue team defense scenarios like sorting through network pcap files to find the infiltrator, ransomware attack analysis, and going through memory dumps to detect hidden malware.

The Toyota Tsusho Systems CTF was intense, hosting some of the most brilliant minds globally.

## Our Team

As team leader, I picked the name BTechn0crats for us—signifying that we're technocrats diving into the junior year of our BTech. The CTF was mainly for MSc Digital Forensics students, but us BTech students have our hands in everything, right? xD

Our team consisted of:
1. Aviral (me :p)
2. Aniket Ji
3. Digvijay Ji
4. Pratham Ji
5. Shiv Awasthi Ji

## Our Strategy 🛠️

Our strategy was the major contributor to our success. As team leader, I was responsible for task delegation, assigning based on everyone's skills and taking on the most time-consuming tasks myself.

1. **Quick Scan**: I first identified the problems that aligned with our skill sets.
2. **Divide and Conquer**: Each team member was tasked with challenges suited to their expertise.
3. **Regular Check-ins**: We met regularly to update on progress or if anyone had an insight that could break the stalemate.

![Problem Solving in Action](https://cdn.gilcdn.com/ContentMediaGenericFiles/a487bb426bba419af6fe5449f89de209-Full.webp?w=870&h=510)
*Focused on a particularly tough problem.*

## The Challenges 🧩

We faced 10 challenges in total (11 if you count the Welcome Flag :p):
- Forensics: 7
- OSINT: 3

Here's a brief on some of the Forensics challenges we tackled:

### Forensics

*WireShark 01* (Easy)
We had to analyze a piece of PCAP to see if hackers managed to exfiltrate the source code. It was pretty basic—either sift through the pcap or get lucky early on by spotting a base64-encoded string.

*WireShark 02* (Medium)
Another PCAP-based challenge, but this one required deeper analysis. The hacker's intent eventually became evident; they used a WordPress reverse shell exploit to download a PDF file using ICMP packets. Extracting the payload was a matter of a few commands—unless you went the python script route, which could take a while. :)

*Windows Registry* (Easy)
This challenge revolved around Windows registry files. Knowing where to look is half the battle here. I used regshell to navigate to the right location and found a base64-encoded flag tucked away. UTF 16 le? Something along those lines.

*Memory Dump Analysis* (Easy, though hard for us)
Five questions from memory dumps would have been a surprise, but we ended up with seven! I barely knew how to use Volatility. The challenge was like a questionnaire, but each query led back into the memory dump. The trick was not just finding a suspicious .exe process but also looking for hidden DLLs associated with it. A lot of this was trial and error coupled with some intelligent guesses. Decrypting the final flag came down to disassembling a code with ILSpy (a tool I had just heard of) and deciphering the encryption key.

The OSINT challenges were relatively straightforward in comparison. We didn't solve all the Forensics challenges, as some were quite tough, but our overall performance was excellent. We managed to grab the 1st position in the CTF—yay!

Thanks to this CTF for always being fun. :)

## The Victory 🥇

Intense hours of dedication paid off as we solved a crucial challenge and ascended the leaderboard.

![Leaderboard Top Position](https://cdn.gilcdn.com/ContentMediaGenericFiles/b43387652bd217130ae9f117c9dcabf9-Full.webp?w=864&h=809)
*The sweetness of victory—topping the leaderboard.*

## Lessons Learned 📚

This CTF taught us:

- Teamwork is key; respecting and trusting your teammates is essential.
- Stepping back to reassess a problem can reveal new solutions.
- Good time management is critical in competition success.

![Group Photograph](https://cdn.gilcdn.com/ContentMediaGenericFiles/5ec2ae78367aee52403e193b60e42933-Full.webp?w=2048&h=1364)
*All CTF Teams combined with the Officials*

## Acknowledgments and Next Steps 🚀

A huge shout-out to my team, the BTechn0crats, for the amazing teamwork, and to the Toyota Tsusho Systems organizers for running such a well-organized competition. We can't wait to defend our title next year!

If you have questions about the competition or cybersecurity, feel free to ask.

*Thank you for reading, and stay secure!* 😊