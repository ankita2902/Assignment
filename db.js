import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'db.json');

const NAMES = ['Aarav','Ananya','Vihaan','Diya','Arjun','Isha','Kabir','Meera','Rohan','Saanvi','Aditya','Kavya','Ishaan','Riya','Neil','Tara','Yash','Naina','Dev','Pooja','Karan','Sneha','Veer','Aditi','Manav','Zoya','Reyansh','Mira','Samar','Anika'];
const PLACES = ['IIT Delhi','Delhi University','BITS Pilani','Mumbai','Bangalore','Lucknow','IIM Ahmedabad','Pune'];
const BIOS = ['Chai over coffee, always.','Will trade playlists for memes.','Weekend trekker, weekday overthinker.','Looking for someone to split fries with.','Amateur chef, professional snacker.','Bookstore wanderer.','Gym at 6am, naps at 3pm.','Ask me about my dog.','Spontaneous road trips > plans.','Here for good conversations.'];
const INTERESTS = ['Music','Trekking','Cooking','Photography','Gaming','Reading','Cricket','Travel','Movies','Art','Fitness','Coding'];

function seed() {
  const profiles = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: NAMES[i],
    age: 19 + ((i * 7) % 10),
    photo: `https://picsum.photos/seed/coy${i + 1}/600/800`,
    bio: BIOS[i % BIOS.length],
    place: PLACES[i % PLACES.length],
    interests: [0, 1, 2].map((k) => INTERESTS[(i * 3 + k * 5) % INTERESTS.length]),
    likesMe: i % 3 === 0, // 10 profiles already like the user; NEVER sent to the client
  }));
  // fixed shuffle so "likes me" profiles aren't clustered / guessable
  profiles.sort((a, b) => ((a.id * 11) % 30) - ((b.id * 11) % 30));
  return { profiles, swipes: {}, matches: [] };
}

export function load() {
  if (!fs.existsSync(FILE)) save(seed());
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

export function save(db) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

export function reset() {
  save(seed());
}

// Strips private fields. Every profile sent to the client goes through this.
export function toPublic({ likesMe, ...rest }) {
  return rest;
}
