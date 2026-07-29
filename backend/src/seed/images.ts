/** Indian-only seed imagery — local /images assets (no foreign stock CDNs) */
const l = (name: string) => `/images/${name}`;

export const SEED_IMAGES = {
  wedding: {
    hero: l('indian-wedding-mandap.png'),
    mandap: l('indian-wedding-mandap.png'),
    couple: l('indian-wedding-couple.png'),
    rituals: l('indian-wedding-rituals.png'),
    courtyard: l('indian-wedding-courtyard.png'),
    bride: l('indian-wedding-bride.png'),
    henna: l('indian-wedding-henna.png'),
    details: l('indian-wedding-henna.png'),
    reception: l('indian-wedding-reception.png'),
  },
  corporate: {
    hero: l('indian-corporate-conference.png'),
    conference: l('indian-corporate-conference.png'),
    meeting: l('indian-corporate-meeting.png'),
    stage: l('indian-corporate-stage.png'),
    networking: l('indian-corporate-networking.png'),
    seminar: l('indian-corporate-meeting.png'),
  },
  birthday: {
    hero: l('indian-birthday-hero.png'),
    cake: l('indian-birthday-cake.png'),
    balloons: l('indian-birthday-balloons.png'),
    party: l('indian-birthday-hero.png'),
    celebration: l('indian-birthday-celebration.png'),
    kids: l('indian-birthday-kids.png'),
  },
  kitty: {
    hero: l('kitty-party-hero.png'),
    table: l('kitty-party-table.png'),
    gathering: l('kitty-party-gathering.png'),
    lunch: l('kitty-party-table.png'),
    decor: l('kitty-party-decor.png'),
    festive: l('kitty-party-hero.png'),
  },
  jagrata: {
    hero: l('mata-jagrata-hero.png'),
    altar: l('mata-jagrata-altar.png'),
    diyas: l('mata-jagrata-diyas.png'),
    lights: l('mata-jagrata-lights.png'),
    flowers: l('mata-jagrata-altar.png'),
    evening: l('mata-jagrata-hero.png'),
  },
  pages: {
    homeHero: l('indian-wedding-mandap.png'),
    aboutStory: l('indian-wedding-couple.png'),
    cta: l('indian-wedding-rituals.png'),
  },
  team: {
    founder: l('indian-team-founder.png'),
    creative: l('indian-team-creative.png'),
    operations: l('indian-team-operations.png'),
  },
  author: l('indian-team-founder.png'),
  avatars: [
    l('indian-avatar-couple.png'),
    l('indian-avatar-man1.png'),
    l('indian-avatar-woman1.png'),
    l('indian-avatar-woman2.png'),
    l('indian-avatar-elder.png'),
    l('indian-avatar-parents.png'),
    l('indian-avatar-man2.png'),
  ],
} as const;
