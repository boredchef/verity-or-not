# verity-or-not
a fun quiz game where progress is saved, review performance and restart game

https://github.com/user-attachments/assets/bc64fa90-d6a4-4026-ab48-987a5331d9f6

vvvvvv

<kbd>[**demo at boredchef.github.io/verity-or-not**](https://boredchef.github.io/verity-or-not)</kbd>

^^^^^^

## what do i do.
my features concise of 
* keep score and highest score!
* save progress and come back (but run out of time)
* each question has a dynamic duration based on word count
* even more questions and a couple categories!
* view your performance on each question
* restart whole save by pressing "r" or "🔄️" button
* smiley face background :DDD yay

## how it work
the html uses different containers for start, questions, score and review and are hidden/styled through css. the javascript manages the games views and sets them accordingly to what the variables want them to be. objects are used to create the questions, answer buttons, populate review container and make a save. the questions are fetched based on what category and how many questions the user wants from [the api](https://opentdb.com/) and are loaded into the questions object.

## credits 
to understand quiz logic i used webdev simplified [build a quiz app](https://youtu.be/riDzcEQbX6k?si=gn-AGeJn4rOKF9Q-)

api being used [OpenTrivia Database](https://opentdb.com/)

| question correct | score screen | review questions | restart |
|-- |-- | --| -- |
| <img width="854" height="435" alt="Screenshot 2026-10-18 233431" src="https://github.com/user-attachments/assets/b002fe6d-df45-4ff8-894b-0c7e6ad02553" />| <img width="842" height="483" alt="Screenshot 2026-10-18 232431" src="https://github.com/user-attachments/assets/266bc980-f9fd-46a5-ae1d-923de0608391" /> | <img width="648" height="483" alt="Screenshot 2026-10-25 215950" src="https://github.com/user-attachments/assets/67ee3105-8bc1-4613-b12d-08c899977955" /> | <img width="925" height="514" alt="Screenshot 2026-10-25 212754" src="https://github.com/user-attachments/assets/9ac52572-f1d4-4cf5-b412-c0cc0cf24efa" /> |

