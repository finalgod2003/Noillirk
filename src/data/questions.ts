import type { Question } from "../types";

export const questions: Question[] = [
  {
    id: "european-capital",
    category: "Places",
    prompt: "Name a capital city in Europe.",
    answers: [
      "Paris",
      "London",
      "Rome",
      "Berlin",
      "Madrid",
      "Amsterdam",
      "Lisbon",
      "Vienna",
      "Prague",
      "Athens",
      "Brussels",
      "Budapest"
    ],
    extraAccepted: ["Copenhagen", "Stockholm", "Dublin", "Warsaw", "Oslo", "Helsinki", "Sofia", "Bucharest"]
  },
  {
    id: "lunch-fruit",
    category: "Food",
    prompt: "Name a fruit you might pack in a lunchbox.",
    answers: [
      "Apple",
      "Banana",
      "Orange",
      "Grapes",
      "Pear",
      "Strawberry",
      "Watermelon",
      "Peach",
      "Mango",
      "Blueberry",
      "Kiwi",
      "Pineapple"
    ],
    extraAccepted: ["Cherry", "Plum", "Tangerine", "Raspberry"]
  },
  {
    id: "dc-hero",
    category: "Comics",
    prompt: "Name a DC Comics superhero.",
    answers: [
      "Superman",
      "Batman",
      "Wonder Woman",
      "The Flash",
      "Aquaman",
      "Green Lantern",
      "Cyborg",
      "Supergirl",
      "Batgirl",
      "Robin",
      "Shazam",
      "Green Arrow"
    ],
    extraAccepted: ["Nightwing", "Black Canary", "Martian Manhunter", "Blue Beetle"]
  },
  {
    id: "butterfly",
    category: "Nature",
    prompt: "Name a kind of butterfly or moth.",
    answers: [
      "Monarch",
      "Swallowtail",
      "Luna moth",
      "Painted lady",
      "Blue morpho",
      "Cabbage white",
      "Tiger moth",
      "Skipper",
      "Red admiral",
      "Atlas moth",
      "Silk moth",
      "Hawk moth"
    ],
    extraAccepted: ["Emperor", "Comma", "Copper", "Hairstreak"]
  },
  {
    id: "lost-things",
    category: "Everyday life",
    prompt: "Name something people lose all the time.",
    answers: [
      "Keys",
      "Phone",
      "Wallet",
      "Socks",
      "Glasses",
      "Pen",
      "Charger",
      "Remote",
      "Earrings",
      "Headphones",
      "Umbrella",
      "Passport"
    ],
    extraAccepted: ["Lighter", "Hair tie", "Ticket", "Bottle"]
  },
  {
    id: "pizza-topping",
    category: "Food",
    prompt: "Name a pizza topping.",
    answers: [
      "Pepperoni",
      "Cheese",
      "Mushrooms",
      "Sausage",
      "Onions",
      "Bacon",
      "Olives",
      "Peppers",
      "Ham",
      "Pineapple",
      "Chicken",
      "Spinach"
    ],
    extraAccepted: ["Tomato", "Basil", "Anchovies", "Jalapenos", "Sweetcorn"]
  },
  {
    id: "pixar-film",
    category: "Movies",
    prompt: "Name a Pixar film.",
    answers: [
      "Toy Story",
      "Finding Nemo",
      "Up",
      "Cars",
      "Monsters, Inc.",
      "The Incredibles",
      "Inside Out",
      "Ratatouille",
      "WALL-E",
      "Brave",
      "Coco",
      "Soul"
    ],
    extraAccepted: ["A Bug's Life", "Luca", "Turning Red", "Elemental"]
  },
  {
    id: "striped-animal",
    category: "Animals",
    prompt: "Name an animal with stripes.",
    answers: [
      "Zebra",
      "Tiger",
      "Cat",
      "Bee",
      "Wasp",
      "Chipmunk",
      "Snake",
      "Fish",
      "Okapi",
      "Raccoon",
      "Badger",
      "Hyena"
    ],
    extraAccepted: ["Skunk", "Lemur", "Butterfly", "Lizard"]
  },
  {
    id: "solar-moon",
    category: "Space",
    prompt: "Name a moon in our solar system.",
    answers: [
      "The Moon",
      "Titan",
      "Europa",
      "Ganymede",
      "Io",
      "Callisto",
      "Triton",
      "Phobos",
      "Deimos",
      "Enceladus",
      "Charon",
      "Titania"
    ],
    extraAccepted: ["Miranda", "Oberon", "Rhea", "Iapetus"]
  },
  {
    id: "board-game",
    aliases: { "Clue": ["Cluedo"], "Catan": ["Settlers of Catan", "The Settlers of Catan"], "Checkers": ["Draughts"] },
    category: "Games",
    prompt: "Name a board game.",
    answers: [
      "Monopoly",
      "Scrabble",
      "Chess",
      "Clue",
      "Risk",
      "Catan",
      "Sorry!",
      "The Game of Life",
      "Trouble",
      "Connect Four",
      "Ticket to Ride",
      "Checkers"
    ],
    extraAccepted: ["Backgammon", "Othello", "Candy Land", "Pictionary"]
  },
  {
    id: "kitchen-drawer",
    category: "Everyday life",
    prompt: "Name something you might find in a kitchen drawer.",
    answers: [
      "Spoon",
      "Fork",
      "Knife",
      "Scissors",
      "Can opener",
      "Corkscrew",
      "Spatula",
      "Whisk",
      "Measuring cups",
      "Bottle opener",
      "Tongs",
      "Peeler"
    ],
    extraAccepted: ["Straws", "Napkins", "Rubber bands", "Matches"]
  },
  {
    id: "ball-sport",
    category: "Sports",
    prompt: "Name a sport played with a ball.",
    answers: [
      "Soccer",
      "Basketball",
      "Tennis",
      "Baseball",
      "Football",
      "Volleyball",
      "Golf",
      "Cricket",
      "Rugby",
      "Table tennis",
      "Bowling",
      "Handball"
    ],
    extraAccepted: ["Badminton", "Squash", "Water polo", "Softball"]
  },
  {
    id: "disney-character",
    category: "Movies",
    prompt: "Name a Disney character.",
    answers: [
      "Mickey Mouse",
      "Donald Duck",
      "Minnie Mouse",
      "Goofy",
      "Elsa",
      "Simba",
      "Ariel",
      "Aladdin",
      "Buzz Lightyear",
      "Woody",
      "Moana",
      "Stitch"
    ],
    extraAccepted: ["Pluto", "Belle", "Genie", "Olaf"]
  },
  {
    id: "south-america",
    category: "Places",
    prompt: "Name a country in South America.",
    answers: [
      "Brazil",
      "Argentina",
      "Chile",
      "Colombia",
      "Peru",
      "Venezuela",
      "Ecuador",
      "Bolivia",
      "Paraguay",
      "Uruguay",
      "Guyana",
      "Suriname"
    ],
    extraAccepted: ["French Guiana"]
  },
  {
    id: "rainbow-color",
    category: "Everyday life",
    prompt: "Name a color in a rainbow.",
    answers: [
      "Red",
      "Orange",
      "Yellow",
      "Green",
      "Blue",
      "Indigo",
      "Violet",
      "Purple",
      "Pink",
      "Cyan",
      "Magenta",
      "Turquoise"
    ]
  },
  {
    id: "breakfast-food",
    category: "Food",
    prompt: "Name a breakfast food.",
    answers: [
      "Eggs",
      "Toast",
      "Cereal",
      "Pancakes",
      "Bacon",
      "Sausage",
      "Waffles",
      "Oatmeal",
      "Bagel",
      "Fruit",
      "Yogurt",
      "Hash browns"
    ],
    extraAccepted: ["Muffin", "Croissant", "Porridge", "French toast"]
  },
  {
    id: "string-instrument",
    category: "Music",
    prompt: "Name an instrument with strings.",
    answers: [
      "Guitar",
      "Violin",
      "Cello",
      "Bass",
      "Ukulele",
      "Harp",
      "Banjo",
      "Viola",
      "Mandolin",
      "Double bass",
      "Sitar",
      "Lute"
    ],
    extraAccepted: ["Piano", "Dulcimer", "Erhu", "Balalaika"]
  },
  {
    id: "at-the-beach",
    category: "Places",
    prompt: "Name something you might see at the beach.",
    answers: [
      "Sand",
      "Ocean",
      "Shells",
      "Towel",
      "Sunscreen",
      "Waves",
      "Umbrella",
      "Crabs",
      "Seagulls",
      "Sunglasses",
      "Surfboard",
      "Rocks"
    ],
    extraAccepted: ["Lifeguard", "Bucket", "Sandcastle", "Ice cream"]
  },
  {
    id: "fast-food",
    category: "Food",
    prompt: "Name a fast-food chain.",
    answers: [
      "McDonald's",
      "Burger King",
      "KFC",
      "Subway",
      "Taco Bell",
      "Wendy's",
      "Domino's",
      "Pizza Hut",
      "Chick-fil-A",
      "Dunkin'",
      "Starbucks",
      "Popeyes"
    ],
    extraAccepted: ["Five Guys", "Chipotle", "Sonic", "Arby's"]
  },
  {
    id: "dog-breed",
    aliases: { "Labrador": ["Lab", "Labrador Retriever"], "Golden Retriever": ["Golden"], "German Shepherd": ["Alsatian", "GSD"] },
    category: "Animals",
    prompt: "Name a dog breed.",
    answers: [
      "Labrador",
      "Golden Retriever",
      "German Shepherd",
      "Bulldog",
      "Poodle",
      "Beagle",
      "Rottweiler",
      "Yorkshire Terrier",
      "Dachshund",
      "Boxer",
      "Husky",
      "Corgi"
    ],
    extraAccepted: ["Chihuahua", "Pug", "Dalmatian", "Border Collie"]
  },
  {
    id: "cold-thing",
    category: "Everyday life",
    prompt: "Name something that is cold.",
    answers: [
      "Ice",
      "Snow",
      "A freezer",
      "Winter",
      "Ice cream",
      "A refrigerator",
      "Antarctica",
      "A popsicle",
      "Air conditioning",
      "An ice cube",
      "A snowman",
      "A glacier"
    ],
    extraAccepted: ["Milk", "Soda", "Frost", "Water"]
  },
  {
    id: "movie-villain",
    category: "Movies",
    prompt: "Name a movie villain.",
    answers: [
      "Darth Vader",
      "The Joker",
      "Thanos",
      "Voldemort",
      "Sauron",
      "The Wicked Witch",
      "Hannibal Lecter",
      "Cruella de Vil",
      "Lord Farquaad",
      "Bane",
      "Loki",
      "Gollum"
    ],
    extraAccepted: ["Palpatine", "Magneto", "Scar", "Ursula"]
  },
  {
    id: "before-bed",
    category: "Everyday life",
    prompt: "Name something people do before bed.",
    answers: [
      "Brush teeth",
      "Shower",
      "Read",
      "Charge their phone",
      "Set an alarm",
      "Put on pajamas",
      "Wash their face",
      "Turn off the lights",
      "Lock the door",
      "Use the bathroom",
      "Do skincare",
      "Journal"
    ],
    extraAccepted: ["Watch TV", "Drink water", "Stretch", "Pray"]
  },
  {
    id: "famous-singer",
    category: "Music",
    prompt: "Name a famous singer.",
    answers: [
      "Taylor Swift",
      "Beyoncé",
      "Michael Jackson",
      "Elvis Presley",
      "Adele",
      "Rihanna",
      "Drake",
      "Madonna",
      "Ed Sheeran",
      "Ariana Grande",
      "Bruno Mars",
      "Lady Gaga"
    ],
    extraAccepted: ["Whitney Houston", "Billie Eilish", "Frank Sinatra", "Cher"]
  },
  {
    id: "weather",
    category: "Nature",
    prompt: "Name a type of weather.",
    answers: [
      "Sunny",
      "Rain",
      "Snow",
      "Cloudy",
      "Windy",
      "Storm",
      "Fog",
      "Hail",
      "Thunder",
      "Tornado",
      "Humid",
      "Drizzle"
    ],
    extraAccepted: ["Sleet", "Heatwave", "Blizzard", "Lightning"]
  },
  {
    id: "hike-kit",
    category: "Outdoors",
    prompt: "Name something you would take on a hike.",
    answers: [
      "Water",
      "Backpack",
      "Shoes",
      "Snacks",
      "Map",
      "Sunscreen",
      "Hat",
      "Camera",
      "Jacket",
      "Compass",
      "First aid kit",
      "Bug spray"
    ],
    extraAccepted: ["Trekking poles", "Phone", "Sandwich", "Raincoat"]
  },
  {
    id: "toy",
    category: "Games",
    prompt: "Name a toy.",
    answers: [
      "Lego",
      "Doll",
      "Ball",
      "Teddy bear",
      "Toy car",
      "Puzzle",
      "Blocks",
      "Kite",
      "Yo-yo",
      "Toy train",
      "Action figure",
      "Rubik's Cube"
    ],
    extraAccepted: ["Slinky", "Play-Doh", "Barbie", "Hot Wheels"]
  },
  {
    id: "vegetable",
    category: "Food",
    prompt: "Name a vegetable.",
    answers: [
      "Carrot",
      "Potato",
      "Broccoli",
      "Onion",
      "Tomato",
      "Lettuce",
      "Cucumber",
      "Corn",
      "Peas",
      "Spinach",
      "Pepper",
      "Cabbage"
    ],
    extraAccepted: ["Pumpkin", "Beetroot", "Cauliflower", "Mushroom"]
  },
  {
    id: "social-app",
    category: "Technology",
    prompt: "Name a social media app.",
    answers: [
      "Instagram",
      "TikTok",
      "Facebook",
      "YouTube",
      "X",
      "Snapchat",
      "Reddit",
      "Pinterest",
      "LinkedIn",
      "WhatsApp",
      "Threads",
      "Discord"
    ],
    extraAccepted: ["Tumblr", "WeChat", "Telegram", "Twitch"]
  },
  {
    id: "things-that-fly",
    category: "Nature",
    prompt: "Name something that flies.",
    answers: [
      "Bird",
      "Airplane",
      "Butterfly",
      "Bee",
      "Helicopter",
      "Rocket",
      "Kite",
      "Balloon",
      "Drone",
      "Bat",
      "Fly",
      "Eagle"
    ],
    extraAccepted: ["Owl", "Pilot", "Frisbee", "Paper plane"]
  },
  {
    id: "school-supply",
    category: "Everyday life",
    prompt: "Name a school supply.",
    answers: [
      "Pencil",
      "Pen",
      "Notebook",
      "Backpack",
      "Eraser",
      "Ruler",
      "Marker",
      "Calculator",
      "Scissors",
      "Glue",
      "Highlighter",
      "Folder"
    ],
    extraAccepted: ["Crayons", "Lunchbox", "Binder", "Pencil case"]
  }
];

export const questionById = new Map(questions.map((question) => [question.id, question]));
