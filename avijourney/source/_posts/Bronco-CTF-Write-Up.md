---
title: Bronco CTF Write Up
date: 2024-05-11 10:25:34
tags: [cybersecurity, writeup, team]
categories: [Writeups]
---

Here is the extended Markdown creation to include all challenges and details. Each section also offers a quick overview and link where appropriate. Just modify links and add details if necessary.

# BroncoCTF Writeup 2024

![BroncoCTF](https://i.imgur.com/CIxjifm.png)

## Published: May 11, 2024

This is a writeup for all challenges from BroncoCTF 2024. Despite the CTF being targeted for beginners, some challenges were quite difficult with unique tasks tailored for different categories. The organizers also have a penchant for binary challenges.

## Team

We are a team of two members, Aviral (error9098x) & Rupam . We managed to solve most of the problems and had a lot of fun doing so, securing the 13th place out of more than 250 teams.

- ![Trident09](https://avatars.githubusercontent.com/u/98939183?v=4)
  [Trident09](https://github.com/Trident09)
- ![error9098x](https://avatars.githubusercontent.com/u/43810146?v=4)
  [error9098x](https://github.com/error9098x)

## Challenges Overview

### Welcome Challenges
- **Don’t Be a Slacker** - A simple challenge to join the communication platform. [🔗](#dont-be-a-slacker)
- **Welcome Challenge** - Requires visiting a specific page to get the flag. [🔗](#welcome-challenge)

### Beginner
- **Keyboard-Elitist** - Solve a message obscured by a substitution cipher. [🔗](#keyboard-elitist)
- **Shrekanana Banana** - A steganography challenge involving an image of Shrek in a banana. [🔗](#shrekanana-banana)
- **Stego-Snore-Us** - Decoding hidden content in an image from a tiresome event. [🔗](#stego-snore-us)

### Crypto
- **Birthday Bash** - Unsolved.
- **Electrical Engineering** - Decode a message using resistor color codes. [🔗](#electrical-engineering)
- **Oh Danny** - Unsolved.
- **Preschool Lessons** - Deciphering a message with a cipher involving the alphabet and binary. [🔗](#preschool-lessons)
- **Zodiac Killer** - Solving a cipher from a notorious series of letters. [🔗](#zodiac-killer)

### Forensics
- **Boom** - Using Minesweeper clues to discover the flag. [🔗](#boom)
- **LAN Party** - Unsolved.
- **Medieval Beats** - Finding flags in a lengthy video. [🔗](#medieval-beats)
- **Mystery Sound** - Unsolved.
- **WarioParty** - A complex challenge involving multiple Steganography methods. [🔗](#warioparty)

### Misc
- **BroncoCTF Crossword** - Finding a hidden message in a crossword puzzle. [🔗](#broncoctf-crossword)
- **Countries Unite!** - Decoding flags using country codes. [🔗](#countries-unite)
- **World’s Hardest Flag** - Unsolved.

### Detailed Challenges
Here we detail each challenge, providing insights and solutions where applicable.

## Don't Be a Slacker

**Difficulty**: Very Easy (10 Points)

### Description
Join our Slack for SCU students or Discord for event updates to participate in our community and find the flag posted in a channel topic.

### Flag
broncoCTF{not_a_slacker}

## Welcome Challenge

**Difficulty**: Very Easy (10 Points)

### Description
Visit our [rules page](https://broncoctf.xyz/rules) and find the flag to ensure you are ready for the CTF.

### Flag
bronco{welcome_to_the_show}

## Keyboard Elitist

**Difficulty**: Beginner (100 Points)

![Keyboard](https://i.imgur.com/xO0NypI.png)

### Description
The garbled message challenge. Requires decoding a message that was typed on an unconventional keyboard layout.

### Flag
bronco{qwerty_vs_c0lem@k}

## Shrekanana Banana

**Difficulty**: Beginner (100 Points)

![Shrekanana Banana](https://i.imgur.com/UwWPeyS.png)

### Description
This challenge revolves around an image of Shrek merged with a banana. Perform image steganography analysis to find the hidden message.

### Flag
bronco{shr3konogr@phy}

## Stego-Snore-Us

**Difficulty**: Beginner (100 Points)

![Stego-Snore-Us](https://i.imgur.com/apTtBSR.png)

### Description
Dealing with an all-nighter themed challenge, this required participants to decode hidden content within a tired looking image.

### Flag
bronco{no_more_all_nighters}

## Electrical Engineering

**Difficulty**: Easy (200 Points)

![Electrical Engineering](https://i.imgur.com/UL4ffkL.png)

### Description
Interpret color codes on resistors to find the flag. This challenge requires knowledge of common coding used in electronic components.

### Flag
bronco{rEsi5t_ev1L}

## Preschool Lessons

**Difficulty**: Easy (150 Points)

![Preschool Lessons](https://i.imgur.com/P6rs6WV.png)

### Description
A cipher involving basic characters where hints suggest a simplicity likening it to preschool alphabet familiarity.

### Flag
bronco{easy_as_abc}

## Zodiac Killer

**Difficulty**: Easy (100 Points)

![Zodiac Killer](https://i.imgur.com/6XDYalx.png)

### Description
Decipher a cryptic message similar to the infamous Zodiac Killer letters. Participants needed to decode symbols to reveal the text.

### Flag
bronco{zodiac_message_decoded}

## Boom

**Difficulty**: Medium (300 Points)

![Boom](https://i.imgur.com/CLK7rHr.png)

### Description
Analyze miscellaneous files indicated to be a part of a Minesweeper game layout to find hidden messages or clues.

### Flag
bronco{minesweeper_master}

## Medieval Beats

**Difficulty**: Easy (200 Points)

![Medieval Beats](https://i.imgur.com/2xWaYt0.png)

### Description
Participants had to review a long medieval-themed music video to spot visual flags displayed at different intervals.

### Flag
bronco{1n_17_f0r_7h3_10n6_h4ul}

## WarioParty

**Difficulty**: Medium (250 Points)

![WarioParty](https://i.imgur.com/ZlMMaWt.png)

### Description
A sophisticated forensic challenge that involved analyzing game-related imagery and using advanced steganographic techniques to uncover the flag.

### Flag
bronco{hidden_in_plain_sight}

## BroncoCTF Crossword

**Difficulty**: Medium (300 Points)

![BroncoCTF Crossword](https://i.imgur.com/Cj2JIxC.png)

### Description
Solve the themed crossword to discover words forming the flag hidden within it. Requires lateral thinking and knowledge of common CTF terminologies.

### Flag
bronco{puzzle_master_found_the_flag}

## Countries Unite!

**Difficulty**: Easy (200 Points)

![Countries Unite!](https://raw.githubusercontent.com/SCUBroncoSec/BroncoCTF-2024-Public/main/Challenges/Misc/Countries%20Unite!/Files/countries.png)

### Description
This challenge involved decoding country flags to find the letter components of the flag, using a method akin to a pictorial cipher.

### Flag
bronco{united_we_st@nd}

## Serpent Pass

**Difficulty**: Medium/Hard (250 Points)

![Serpent Pass](https://i.imgur.com/J1pnmWT.png)

### Description
This reversing challenge involved interacting with a Python-based server that simulated a security gate. Participants had to reverse the server logic to successfully bypass the gates.

### Flag
bronco{w0w_uR_@_g00d_gu3ss3r}

## ACM Borg Members

**Difficulty**: Easy (200 Points)

![ACM Borg Members](https://i.imgur.com/940GDoK.png)

### Description
Web challenge to discover hidden information about the ACM club members by exploring the university's ACM website and finding secret pages or files.

### Flag
bronco{be3p_b0op_@CM_are_cyb0rgs}

## All I Do Is

**Difficulty**: Easy/Medium (250 Points)

![All I Do Is](https://i.imgur.com/7reYeBc.png)

### Description
The participants needed to use the `dig` command to explore DNS records for intriguing hints and messages hidden within different DNS record types.

### Flag
bronco{Finding_diamonds_aint_so_hard_just_dig_baby_dig}

## Blue Boy Storage

**Difficulty**: Easy (200 Points)

![Blue Boy Storage](https://i.imgur.com/ZlMMaWt.png)

### Description
Explore storage techniques in web-based applications focusing on client-side storage solutions like cookies, local storage, and session storage to find the flag.

### Flag
bronco{ab4_d3_4ba_d1e_1m_blu3}

## Blue Herring

**Difficulty**: Easy (200 Points)

![Blue Herring](https://i.imgur.com/cEelEXY.png)

### Description
A tricky web challenge where a misleading clue (red herring) directs participants away from the true flag location, testing their perseverance and attention to detail.

### Flag
bronco{D1s_H3rr1ng_Sh0uld4_B33n_Blue}

## Wiki Wiki Wiki

**Difficulty**: Medium (250 Points)

![Wiki Wiki Wiki](https://i.imgur.com/07zVPsI.png)

### Description
Participants are given an IP address and must use online resources like Wikipedia to hunt down the flag associated with that specific IP.

### Flag
bronco{cNi76bV2IVERlh97hP}

## Lost Valentine

**Difficulty**: Hard (550 Points)

![Lost Valentine](https://i.imgur.com/HEwtVsy.png)

### Description
An OSINT challenge requiring participants to piece together scattered information across multiple platforms and repositories to rebuild the context and find the flag.

### Flag
bronco{lost_my_lover_but_took_a_detour}

## Side Quest

**Difficulty**: Medium/Hard (375 Points)

![Side Quest](https://i.imgur.com/FM7czql.png)

### Description
Hidden within the "Lost Valentine" challenge, this quest required additional sleuthing on social platforms and unconventional websites to uncover hidden messages.

### Flag
bronco{lost_my_lover_but_took_a_detour}

## Thank You

Thank you to all participants and organizers of BroncoCTF 2024. We hope you had as much fun cracking these challenges as we had creating them!

![Thank You](https://i.imgur.com/2wlULdW.jpg)