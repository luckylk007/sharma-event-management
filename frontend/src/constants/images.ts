/**
 * Indian-only event imagery (local assets in /public/images).
 * No foreign stock CDNs — every photo depicts Indian people, venues, or culture.
 */
const local = (name: string) => `/images/${name}`;

export const IMAGES = {
  wedding: {
    hero: local('indian-wedding-mandap.png'),
    mandap: local('indian-wedding-mandap.png'),
    couple: local('indian-wedding-couple.png'),
    rituals: local('indian-wedding-rituals.png'),
    courtyard: local('indian-wedding-courtyard.png'),
    bride: local('indian-wedding-bride.png'),
    henna: local('indian-wedding-henna.png'),
    details: local('indian-wedding-henna.png'),
    reception: local('indian-wedding-reception.png'),
  },
  corporate: {
    hero: local('indian-corporate-conference.png'),
    conference: local('indian-corporate-conference.png'),
    meeting: local('indian-corporate-meeting.png'),
    stage: local('indian-corporate-stage.png'),
    networking: local('indian-corporate-networking.png'),
    seminar: local('indian-corporate-meeting.png'),
  },
  birthday: {
    hero: local('indian-birthday-hero.png'),
    cake: local('indian-birthday-cake.png'),
    balloons: local('indian-birthday-balloons.png'),
    party: local('indian-birthday-hero.png'),
    celebration: local('indian-birthday-celebration.png'),
    kids: local('indian-birthday-kids.png'),
  },
  kitty: {
    hero: local('kitty-party-hero.png'),
    table: local('kitty-party-table.png'),
    gathering: local('kitty-party-gathering.png'),
    lunch: local('kitty-party-table.png'),
    decor: local('kitty-party-decor.png'),
    festive: local('kitty-party-hero.png'),
  },
  jagrata: {
    hero: local('mata-jagrata-hero.png'),
    altar: local('mata-jagrata-altar.png'),
    diyas: local('mata-jagrata-diyas.png'),
    lights: local('mata-jagrata-lights.png'),
    flowers: local('mata-jagrata-altar.png'),
    evening: local('mata-jagrata-hero.png'),
  },
  pages: {
    homeHero: local('indian-wedding-mandap.png'),
    aboutHero: local('indian-wedding-henna.png'),
    aboutStory: local('indian-wedding-couple.png'),
    servicesHero: local('indian-wedding-courtyard.png'),
    galleryHero: local('indian-wedding-reception.png'),
    blogHero: local('indian-wedding-bride.png'),
    contactHero: local('mata-jagrata-diyas.png'),
    cta: local('indian-wedding-rituals.png'),
  },
  team: {
    founder: local('indian-team-founder.png'),
    creative: local('indian-team-creative.png'),
    operations: local('indian-team-operations.png'),
  },
  avatars: {
    a1: local('indian-avatar-couple.png'),
    a2: local('indian-avatar-man1.png'),
    a3: local('indian-avatar-woman1.png'),
    a4: local('indian-avatar-woman2.png'),
    a5: local('indian-avatar-elder.png'),
    a6: local('indian-avatar-parents.png'),
    a7: local('indian-avatar-man2.png'),
  },
} as const;
