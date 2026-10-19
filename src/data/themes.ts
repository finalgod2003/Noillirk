import type { Question } from "../types";

export interface ThemePack {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

// Original editorial prompts and rankings; these are not survey results.
const prompt = (id: string, category: string, text: string, answers: string[], extraAccepted: string[] = []): Question =>
  ({ id, category, prompt: text, answers, extraAccepted });

export const themes: ThemePack[] = [
  {
    id: "food",
    name: "Comfort Kitchen",
    description: "Breakfast rituals, midnight snacks, and familiar flavours.",
    questions: [
      prompt("kitchen-toast", "Comfort Kitchen", "Name something people spread on toast.", ["Butter", "Jam", "Peanut butter", "Honey", "Marmalade", "Nutella", "Avocado", "Cream cheese", "Margarine", "Marmite", "Hummus", "Chocolate spread"], ["Vegemite", "Ricotta", "Pesto"]),
      prompt("kitchen-soup", "Comfort Kitchen", "Name a soup people eat on a cold day.", ["Chicken soup", "Tomato soup", "Vegetable soup", "Mushroom soup", "Pumpkin soup", "Lentil soup", "Minestrone", "Onion soup", "Potato soup", "Miso soup", "Clam chowder", "Pea soup"], ["Borscht", "Pho", "Ramen"]),
      prompt("kitchen-popcorn", "Comfort Kitchen", "Name a snack people eat while watching a film.", ["Popcorn", "Chips", "Candy", "Chocolate", "Nachos", "Pretzels", "Ice cream", "Cookies", "Nuts", "Pizza", "Crackers", "Gummy bears"], ["Grapes", "Brownies", "Crisps"]),
      prompt("kitchen-salad", "Comfort Kitchen", "Name something in a green salad.", ["Lettuce", "Cucumber", "Tomato", "Spinach", "Avocado", "Onion", "Carrot", "Arugula", "Olives", "Croutons", "Peppers", "Celery"], ["Kale", "Radish", "Feta"]),
      prompt("kitchen-bake", "Comfort Kitchen", "Name an ingredient people use to bake a cake.", ["Flour", "Sugar", "Eggs", "Butter", "Milk", "Baking powder", "Vanilla", "Cocoa", "Oil", "Salt", "Baking soda", "Cream"], ["Yogurt", "Chocolate", "Lemon"]),
      prompt("kitchen-breakfast", "Comfort Kitchen", "Name a drink people have with breakfast.", ["Coffee", "Tea", "Orange juice", "Milk", "Water", "Apple juice", "Hot chocolate", "Smoothie", "Latte", "Cappuccino", "Grapefruit juice", "Soy milk"], ["Oat milk", "Matcha", "Lemon water"]),
      prompt("kitchen-pizza", "Comfort Kitchen", "Name a pizza topping other than cheese.", ["Pepperoni", "Mushrooms", "Ham", "Pineapple", "Olives", "Peppers", "Onion", "Sausage", "Bacon", "Chicken", "Tomato", "Basil"], ["Anchovies", "Spinach", "Corn"])
    ]
  },
  {
    id: "outdoors",
    name: "Into the Wild",
    description: "Campsites, gardens, and a little fresh-air instinct.",
    questions: [
      prompt("wild-camp", "Into the Wild", "Name something you pack for a camping trip.", ["Tent", "Sleeping bag", "Flashlight", "Water", "Food", "Matches", "Backpack", "Blanket", "Stove", "First aid kit", "Map", "Insect repellent"], ["Compass", "Hammock", "Tarp"]),
      prompt("wild-beach", "Into the Wild", "Name something people take to the beach.", ["Towel", "Sunscreen", "Swimsuit", "Umbrella", "Sunglasses", "Water", "Sandals", "Hat", "Bucket", "Ball", "Cooler", "Book"], ["Surfboard", "Goggles", "Chair"]),
      prompt("wild-garden", "Into the Wild", "Name a tool used in a garden.", ["Shovel", "Rake", "Hose", "Trowel", "Watering can", "Pruners", "Spade", "Hoe", "Lawn mower", "Wheelbarrow", "Shears", "Fork"], ["Sprinkler", "Dibber", "Secateurs"]),
      prompt("wild-pond", "Into the Wild", "Name an animal you might see near a pond.", ["Duck", "Frog", "Fish", "Turtle", "Dragonfly", "Swan", "Goose", "Heron", "Toad", "Snail", "Newt", "Beaver"], ["Otter", "Mosquito", "Kingfisher"]),
      prompt("wild-weather", "Into the Wild", "Name a type of weather that could spoil a picnic.", ["Rain", "Thunderstorm", "Wind", "Snow", "Hail", "Heat", "Fog", "Drizzle", "Sleet", "Cold", "Lightning", "Sandstorm"], ["Blizzard", "Hurricane", "Tornado"]),
      prompt("wild-sky", "Into the Wild", "Name something you can see in the night sky.", ["Moon", "Stars", "Planets", "Clouds", "Shooting star", "Airplane", "Satellite", "Milky Way", "Comet", "Aurora", "Meteor", "Constellation"], ["Venus", "Jupiter", "Mars"]),
      prompt("wild-walk", "Into the Wild", "Name something you hear on a woodland walk.", ["Birds", "Wind", "Leaves", "Footsteps", "Stream", "Insects", "Rain", "Woodpecker", "Owl", "Squirrel", "Crickets", "Waterfall"], ["Frogs", "Bees", "Thunder"])
    ]
  },
  {
    id: "everyday",
    name: "Small Everyday Things",
    description: "The tiny habits and objects everyone recognises.",
    questions: [
      prompt("day-door", "Small Everyday Things", "Name something people check before leaving home.", ["Keys", "Phone", "Wallet", "Door", "Weather", "Lights", "Stove", "Windows", "Time", "Bag", "Oven", "Lock"], ["Alarm", "Tickets", "Umbrella"]),
      prompt("day-desk", "Small Everyday Things", "Name something on an office desk.", ["Computer", "Keyboard", "Mouse", "Pen", "Notebook", "Phone", "Monitor", "Mug", "Lamp", "Calendar", "Paper", "Stapler"], ["Headphones", "Plant", "Sticky notes"]),
      prompt("day-rain", "Small Everyday Things", "Name something people do indoors on a rainy day.", ["Read", "Watch TV", "Sleep", "Cook", "Play games", "Bake", "Clean", "Listen to music", "Draw", "Work", "Exercise", "Do a puzzle"], ["Knit", "Paint", "Study"]),
      prompt("day-train", "Small Everyday Things", "Name something people do on a train journey.", ["Read", "Sleep", "Listen to music", "Look out the window", "Use phone", "Talk", "Eat", "Work", "Watch a film", "Play games", "Drink", "Study"], ["Knit", "Write", "Draw"]),
      prompt("day-bag", "Small Everyday Things", "Name something people keep in a bag.", ["Phone", "Wallet", "Keys", "Water bottle", "Tissues", "Pen", "Headphones", "Charger", "Book", "Umbrella", "Sunglasses", "Snacks"], ["Lip balm", "Hand sanitizer", "Notebook"]),
      prompt("day-weekend", "Small Everyday Things", "Name a household chore people do at the weekend.", ["Laundry", "Vacuuming", "Cleaning", "Shopping", "Dishes", "Mowing", "Ironing", "Dusting", "Gardening", "Mopping", "Cooking", "Taking out trash"], ["Changing sheets", "Washing windows", "Decluttering"]),
      prompt("day-alarm", "Small Everyday Things", "Name something people do after their alarm rings.", ["Snooze", "Get up", "Turn it off", "Stretch", "Check phone", "Yawn", "Shower", "Brush teeth", "Make coffee", "Get dressed", "Eat breakfast", "Open curtains"], ["Drink water", "Make the bed", "Exercise"])
    ]
  }
];

export const getTheme = (id?: string) => themes.find((theme) => theme.id === id);
