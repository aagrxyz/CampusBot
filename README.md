
CampusBot
===================
 [Chat with Me](http://bit.ly/campusbot)

Campus Bot is a chat bot that was built for **Code.fun.do** organised by Microsoft at IIT Delhi on 7th January 2016.
Campus Bot is one stop solution for all the campus needs that students and the faculty in the campus can use. 
It has been integrated into numerous chatting platforms.
Presently the bot has been trained for IITD but it can be later on trained for any campus by just modifying the format of the entry number i.e the Admission number. 
It has many functionalities which are described below:

 1. **Profile :** The first time user says a *Hi*, the bot replies back by asking the user, his/her name and entry number which will be used for all future correspondences and chats.
 2. **FAQ :** The user can ask faqs related to any institute policy and even ask for telephone numbers. The FAQ mode can be started by sending faq as a message.
 3. **Who is this? :** This allows the user to ask the details about any student in the IITD campus by just sending a message *"who is (name/entry number)"*  . The bot replies by telling the name, entry number and the email address where the user can contact the person.
 4. **fb Events :** Various clubs of IIT Delhi, have their fb pages and regularly post the events. But unfortunately, there is no centralised service which can tell them the events going on in the campus. This chat bot tells you the events going on and the future events by just sending *"events"* as a message.
 5. ***Academic Tasks :***
	6. **Course Info :** The bot tells about the information of the course that is floated in the present semester by just sending the message "course < course_code > ".
	7. **Class Schedule :** The user can ask about his/her classes schedule for the day, for tomorrow, for a specific date or for the complete week. This can be achieved by the message *"schedule for < specific_date >"* or by *"schedule"* to get the full week's schedule.
	8. **Paper Download :** The user can download Past Question papers for the courses they are registered in by just sending a message *"Question papers"*. These question papers can be really helpful while preparing for exams.
 6. **Complaint System :** This is a very useful feature as it lets the user lodge a complaint for any problem by just sending a message *"complaint"* and then answering the questions regarding the complaint. The complaints logged can be viewed at [Complaints Page](http://www.cse.iitd.ernet.in/aces-acm/complaints).
 7. **Conversation :** At last the bot can perform intelligent chats with the user. This dialog mode can be started by the *"converse"* message. To exit the mode send the message *"end"*.

----------

Technology and APIs used
-------------
1. The bot is built on the [Microsoft Bot Builder Framework](https://dev.botframework.com/) in Node.js and uses various APIs
2.  It uses the [Language Understanding Intelligent Service (LUIS)](https://www.luis.ai/) that lets the bot to understand language.
3. It uses the [QnA Maker](https://qnamaker.ai/) that enabled us to build, train and publish a simple question and answer bot based on FAQ URLs.
4. It uses the [Graph API](https://developers.facebook.com/docs/graph-api) to parse the fb Pages and then display events.
5. It uses a [web2py](http://www.web2py.com/) server to provide the details of the complaints logged, class schedule, paper download, and the course info.
6. It uses [CleverBot](http://www.cleverbot.com/) API to converse with the user in the conversation mode.


Publication
-------------
The bot is presently published on various platforms as described below :

1.  [Web App](http://bit.ly/campusbot)
2. Skype: Campus-Bot
3. Telegram: @Super_Campus_Bot
4. It is presently for review on fb Messenger.

For the demo video, follow the Link [CampusBot Demo Video](https://1drv.ms/f/s!AjbJsd8eLElBhRXu41mAwvNdqjc3)

