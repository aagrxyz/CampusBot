with open("faq_phone.txt","w") as faq_phone:
	for topics in database:
		topic = topics['name']
		for sub_topic in topics['nums']:
			ques = "Q. What is phone number of "+sub_topic['name']+"?"
			ans = "A. "+sub_topic['no']
			faq_phone.write(ques+"\n"+ans+"\n\n")
