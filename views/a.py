import random

# Define some responses for the chatbot
greeting_responses = ["Hello!", "Hi there!", "Hey!", "Howdy!"]
help_responses = ["How can I help you?", "What can I assist you with?", "How may I be of service?"]
goodbye_responses = ["Goodbye!", "See you later!", "Farewell!"]

# Define a function for the chatbot to respond to user input
def respond(input_text):
    # Convert user input to lowercase for easier matching
    input_text = input_text.lower()

    # Greeting response
    if "hello" in input_text or "hi" in input_text or "hey" in input_text or "hiya" in input_text:
        return random.choice(greeting_responses)

    # Help response
    elif "help" in input_text or "assist" in input_text or "support" in input_text:
        return random.choice(help_responses)

    # Goodbye response
    elif "bye" in input_text or "goodbye" in input_text:
        return random.choice(goodbye_responses)

    # Default response
    else:
        return "I'm sorry, I don't understand. Can you please rephrase your question?"

# Main function to run the chatbot
def run_chatbot():
    print("Welcome to the college chatbot! How can I assist you today?")

    # Loop to keep the chatbot running until the user says goodbye
    while True:
        user_input = input("You: ")
        chatbot_response = respond(user_input)
        print("Chatbot:", chatbot_response)

        # Exit the loop if the user says goodbye
        if "bye" in user_input or "goodbye" in user_input:
            break

# Call the main function to run the chatbot
run_chatbot()
