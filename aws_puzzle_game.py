#!/usr/bin/env python3
"""
AWS Services Puzzle Game
A fun quiz game to test your knowledge of AWS services.
"""
import random
import time
import os

class AWSPuzzleGame:
    def __init__(self):
        self.score = 0
        self.aws_services = {
            "EC2": "Elastic compute service that provides resizable compute capacity in the cloud",
            "S3": "Object storage service that offers industry-leading scalability, data availability, security, and performance",
            "Lambda": "Serverless compute service that lets you run code without provisioning or managing servers",
            "DynamoDB": "Fully managed NoSQL database service that provides fast and predictable performance with seamless scalability",
            "RDS": "Managed relational database service that makes it easy to set up, operate, and scale a relational database",
            "CloudFront": "Content delivery network service that securely delivers data, videos, applications, and APIs to customers globally",
            "IAM": "Web service that helps you securely control access to AWS resources",
            "VPC": "Service that lets you launch AWS resources in a logically isolated virtual network",
            "SNS": "Fully managed messaging service for both application-to-application and application-to-person communication",
            "SQS": "Fully managed message queuing service that enables you to decouple and scale microservices",
            "CloudWatch": "Monitoring and observability service that provides data and actionable insights for AWS resources",
            "Route53": "Highly available and scalable cloud Domain Name System (DNS) web service",
            "ECS": "Fully managed container orchestration service",
            "EKS": "Managed Kubernetes service that makes it easy to run Kubernetes on AWS",
            "Fargate": "Serverless compute engine for containers that works with both ECS and EKS",
            "Glacier": "Secure, durable, and extremely low-cost storage service for data archiving and long-term backup",
            "Redshift": "Fully managed, petabyte-scale data warehouse service in the cloud",
            "ElastiCache": "In-memory caching service that supports Redis and Memcached engines",
            "SageMaker": "Fully managed service that enables developers and data scientists to build, train, and deploy machine learning models",
            "Athena": "Interactive query service that makes it easy to analyze data in Amazon S3 using standard SQL"
        }
        
    def clear_screen(self):
        """Clear the terminal screen."""
        os.system('cls' if os.name == 'nt' else 'clear')
        
    def display_welcome(self):
        """Display welcome message and game instructions."""
        self.clear_screen()
        print("=" * 60)
        print("Welcome to the AWS Services Puzzle Game!")
        print("=" * 60)
        print("\nTest your knowledge of AWS services with these fun challenges.")
        print("\nYou'll be presented with different types of puzzles about AWS services.")
        print("Try to answer correctly to earn points!")
        print("\nPress Enter to start...")
        input()
        
    def guess_service_from_description(self):
        """Challenge: Guess the AWS service from its description."""
        self.clear_screen()
        print("\n=== CHALLENGE: Name That AWS Service ===\n")
        print("I'll give you a description of an AWS service.")
        print("You need to guess which service it is.\n")
        
        # Select a random service
        service, description = random.choice(list(self.aws_services.items()))
        
        print(f"Description: {description}")
        
        # Get user's guess
        guess = input("\nWhat AWS service is this? ").strip()
        
        if guess.upper() == service.upper():
            print("\n✓ Correct! Well done!")
            self.score += 10
        else:
            print(f"\n✗ Sorry, the correct answer was {service}.")
            
        print(f"Current score: {self.score}")
        time.sleep(2)
        
    def match_service_to_description(self):
        """Challenge: Match AWS services to their descriptions."""
        self.clear_screen()
        print("\n=== CHALLENGE: Match Services to Descriptions ===\n")
        
        # Select 4 random services
        services = random.sample(list(self.aws_services.items()), 4)
        
        # Display services
        print("Services:")
        for i, (service, _) in enumerate(services, 1):
            print(f"{i}. {service}")
            
        # Display descriptions in random order
        random.shuffle(services)
        print("\nDescriptions:")
        for i, (_, description) in enumerate(services, 1):
            print(f"{chr(96+i)}. {description}")
            
        # Get user's matches
        correct_matches = 0
        print("\nMatch each service (1-4) with its description (a-d):")
        
        for i, (service, _) in enumerate(services, 1):
            user_match = input(f"Service {i} matches description: ").strip().lower()
            if user_match and ord(user_match[0]) - 96 == i:
                correct_matches += 1
                
        print(f"\nYou got {correct_matches} out of 4 matches correct!")
        self.score += correct_matches * 5
        print(f"Current score: {self.score}")
        time.sleep(2)
        
    def fill_in_the_blanks(self):
        """Challenge: Fill in the missing letters in AWS service names."""
        self.clear_screen()
        print("\n=== CHALLENGE: Fill in the Blanks ===\n")
        
        # Select a random service
        service = random.choice(list(self.aws_services.keys()))
        
        # Create a masked version with some letters replaced by underscores
        masked = list(service)
        num_to_mask = min(len(service) - 1, max(2, len(service) // 2))
        mask_positions = random.sample(range(len(service)), num_to_mask)
        
        for pos in mask_positions:
            masked[pos] = '_'
            
        masked_service = ''.join(masked)
        
        print(f"Fill in the missing letters: {masked_service}")
        
        # Get user's answer
        guess = input("\nWhat's the AWS service? ").strip()
        
        if guess.upper() == service.upper():
            print("\n✓ Correct! Nice job!")
            self.score += 8
        else:
            print(f"\n✗ Sorry, the correct answer was {service}.")
            
        print(f"Current score: {self.score}")
        time.sleep(2)
        
    def unscramble_service(self):
        """Challenge: Unscramble the letters to form an AWS service name."""
        self.clear_screen()
        print("\n=== CHALLENGE: Unscramble the Service ===\n")
        
        # Select a service with at least 4 letters
        eligible_services = [s for s in self.aws_services.keys() if len(s) >= 4]
        service = random.choice(eligible_services)
        
        # Scramble the letters
        letters = list(service)
        random.shuffle(letters)
        scrambled = ''.join(letters)
        
        print(f"Unscramble these letters to form an AWS service name: {scrambled}")
        
        # Get user's answer
        guess = input("\nWhat's the AWS service? ").strip()
        
        if guess.upper() == service.upper():
            print("\n✓ Correct! Great unscrambling!")
            self.score += 12
        else:
            print(f"\n✗ Sorry, the correct answer was {service}.")
            
        print(f"Current score: {self.score}")
        time.sleep(2)
        
    def play_game(self):
        """Main game loop."""
        self.display_welcome()
        
        challenges = [
            self.guess_service_from_description,
            self.match_service_to_description,
            self.fill_in_the_blanks,
            self.unscramble_service
        ]
        
        num_rounds = 5
        for round_num in range(1, num_rounds + 1):
            self.clear_screen()
            print(f"\n=== Round {round_num}/{num_rounds} ===")
            print(f"Current score: {self.score}\n")
            
            # Select a random challenge
            challenge = random.choice(challenges)
            challenge()
            
        # Game over
        self.clear_screen()
        print("\n" + "=" * 60)
        print(f"Game Over! Your final score is: {self.score} points")
        print("=" * 60)
        
        if self.score >= 40:
            print("\nAmazing! You're an AWS expert!")
        elif self.score >= 25:
            print("\nGreat job! You know your AWS services well!")
        else:
            print("\nGood effort! Keep learning about AWS services!")
            
        print("\nThanks for playing the AWS Services Puzzle Game!")
        
if __name__ == "__main__":
    game = AWSPuzzleGame()
    game.play_game()
