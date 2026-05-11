// client/src/config/protocols.js

export const PROTOCOLS = {
  v1: {
    avlt: {
      listA: [
        "Drum", "Curtain", "Bell", "Coffee", "School",
        "Parent", "Moon", "Garden", "Hat", "Farmer",
        "Nose", "Turkey", "Colour", "House", "River",
      ],

      listB: [
        "Desk", "Ranger", "Bird", "Shoe", "Stove",
        "Mountain", "Glasses", "Towel", "Cloud", "Boat",
        "Lamb", "Gun", "Pencil", "Church", "Fish",
      ],

      recognitionWords: [
        "Bell", "Home", "Towel", "Boat", "Glasses",
        "Window", "Fish", "Curtain", "Hot", "Stocking",
        "Hat", "Moon", "Flower", "Parent", "Shoe",
        "Barn", "Tree", "Colour", "Water", "Teacher",
        "Ranger", "Balloon", "Desk", "Farmer", "Stove",
        "Nose", "Bird", "Gun", "Rose", "Nest",
        "Weather", "Mountain", "Crayon", "Cloud", "Children",
        "School", "Coffee", "Church", "House", "Drum",
        "Hand", "Mouse", "Turkey", "Stranger", "Toffee",
        "Pencil", "River", "Fountain", "Garden", "Lamb",
      ],
    },

    fingerTapping: {
      targetSequence: "41324",
      session1Rounds: 12,
      session2Rounds: 3,
    },

    nBack: {
      practice: {
        zeroBack: [
          "J", "S", "B", "T", "G", "N", "G", "Q", "Z", "K",
          "B", "Z", "K", "T", "Q", "T", "G", "Z", "Z", "G",
        ],

        oneBack: [
          "X", "P", "K", "R", "D", "T", "X", "V", "V", "P",
          "J", "J", "J", "P", "P", "H", "N", "H", "H", "N",
        ],

        twoBack: [
          "Q", "N", "S", "V", "B", "H", "B", "H", "P", "X",
          "P", "C", "X", "C", "M", "K", "M", "K", "M", "K",
        ],
      },

      real: {
        zeroBackSession1: [
          "J", "S", "B", "T", "G", "N", "G", "Q", "Z", "K",
          "B", "Z", "K", "T", "Q", "T", "G", "Z", "Z", "G",
          "Z", "Z", "B", "Z", "S", "Z", "Z", "Z", "B", "B",
          "Z", "N", "J", "Z", "V", "V",
        ],

        zeroBackSession2: [
          "J", "S", "B", "T", "G", "N", "G", "Q", "Z", "K",
          "B", "Z", "K", "T", "Q", "T", "G", "Z", "Z", "G",
          "Z", "Z", "B", "Z", "S", "Z", "Z", "Z", "B", "B",
          "Z", "N", "J", "Z", "V", "V",
        ],

        oneBackSession1: [
          "X", "P", "K", "R", "D", "T", "X", "V", "V", "P",
          "J", "J", "J", "P", "P", "H", "N", "H", "H", "N",
          "B", "B", "N", "N", "T", "M", "T", "T", "J", "P",
          "P", "P", "J", "J", "H", "H",
        ],

        oneBackSession2: [
          "X", "P", "K", "R", "D", "T", "X", "V", "V", "P",
          "J", "J", "J", "P", "P", "H", "N", "H", "H", "N",
          "B", "B", "N", "N", "T", "M", "T", "T", "J", "P",
          "P", "P", "J", "J", "H", "H",
        ],

        twoBackSession1: [
          "Q", "N", "S", "V", "B", "H", "B", "H", "P", "X",
          "P", "C", "X", "C", "M", "K", "M", "K", "M", "K",
          "V", "S", "F", "V", "V", "S", "F", "F", "N", "C",
          "N", "C", "M", "J", "M", "J",
        ],

        twoBackSession2: [
          "Q", "N", "S", "V", "B", "H", "B", "H", "P", "X",
          "P", "C", "X", "C", "M", "K", "M", "K", "M", "K",
          "V", "S", "F", "V", "V", "S", "F", "F", "N", "C",
          "N", "C", "M", "J", "M", "J",
        ],
      },
    },
  },

  v2: {
    avlt: {
      listA: [
        "Pipe", "Wall", "Alarm", "Sugar", "Student",
        "Mother", "Star", "Painting", "Bag", "Wheat",
        "Mouth", "Chicken", "Sound", "Door", "Stream",
      ],

      listB: [
        "Bench", "Officer", "Cage", "Sock", "Fridge",
        "Cliff", "Bottle", "Soap", "Sky", "Ship",
        "Goat", "Bullet", "Paper", "Chapel", "Crab",
      ],

      recognitionWords: [
        "Alarm", "Eye", "Soap", "Ship", "Bottle",
        "Aunt", "Crab", "Wall", "Car", "Seat",
        "Bag", "Star", "Clock", "Mother", "Sock",
        "Creek", "Rag", "Sound", "Duck", "Tone",
        "Officer", "Bun", "Bench", "Wheat", "Fridge",
        "Mouth", "Cage", "Bullet", "Floor", "Rock",
        "Arrow", "Cliff", "Night", "Sky", "Bread",
        "Student", "Sugar", "Chapel", "Door", "Pipe",
        "Hail", "Cream", "Chicken", "Bridge", "Ball",
        "Paper", "Stream", "Coat", "Painting", "Goat",
      ],
    },

    fingerTapping: {
      targetSequence: "23142",
      session1Rounds: 12,
      session2Rounds: 3,
    },

    nBack: {
      practice: {
        zeroBack: [
          "S", "J", "Q", "G", "N", "Z", "K", "B", "T", "Z",
          "Q", "T", "Q", "T", "Z", "Z", "G", "B", "K", "T",
        ],

        oneBack: [
          "P", "X", "D", "R", "T", "J", "J", "V", "P", "V",
          "V", "V", "H", "P", "P", "X", "H", "H", "N", "J",
        ],

        twoBack: [
          "N", "V", "B", "H", "B", "H", "M", "C", "X", "C",
          "M", "K", "M", "N", "S", "K", "S", "K", "S", "K",
        ],
      },

      real: {
        zeroBackSession1: [
          "S", "T", "Q", "G", "N", "J", "G", "Z", "K", "B",
          "Z", "Q", "G", "T", "G", "Z", "Z", "T", "G", "B",
          "Z", "Z", "N", "S", "Z", "Z", "Z", "H", "H", "Z",
          "N", "Z", "V", "Z", "J", "V",
        ],

        zeroBackSession2: [
          "S", "T", "Q", "G", "N", "J", "G", "Z", "K", "B",
          "Z", "Q", "G", "T", "G", "Z", "Z", "T", "G", "B",
          "Z", "Z", "N", "S", "Z", "Z", "Z", "H", "H", "Z",
          "N", "Z", "V", "Z", "J", "V",
        ],

        oneBackSession1: [
          "P", "K", "X", "D", "R", "V", "T", "T", "P", "J",
          "J", "J", "X", "X", "B", "N", "B", "B", "N", "J",
          "T", "T", "N", "N", "M", "T", "M", "M", "V", "P",
          "P", "P", "J", "J", "H", "H",
        ],

        oneBackSession2: [
          "X", "P", "K", "P", "K", "X", "D", "R", "V", "T",
          "T", "P", "J", "J", "J", "X", "X", "B", "N", "B",
          "B", "N", "J", "T", "T", "N", "N", "M", "T", "M",
          "M", "V", "P", "P", "P", "J", "J", "H", "H",
        ],

        twoBackSession1: [
          "N", "S", "Q", "B", "H", "B", "H", "S", "X", "P",
          "X", "S", "C", "X", "C", "K", "M", "K", "M", "K",
          "S", "F", "V", "V", "S", "F", "F", "V", "C", "N",
          "C", "N", "D", "J", "D", "J",
        ],

        twoBackSession2: [
          "N", "S", "Q", "B", "H", "B", "H", "S", "X", "P",
          "X", "S", "C", "X", "C", "K", "M", "K", "M", "K",
          "S", "F", "V", "V", "S", "F", "F", "V", "C", "N",
          "C", "N", "D", "J", "D", "J",
        ],
      },
    },
  },
};

export function getProtocol(protocolVersion = "v2") {
  return PROTOCOLS[protocolVersion] || PROTOCOLS.v2;
}