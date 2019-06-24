'use strict';

[{
  zoneRegex: /(Eureka Hydatos|Unknown Zone \(33B\)|丰水之地)/,
  timelineFile: 'eureka_hydatos.txt',
  resetWhenOutOfCombat: false,
  timelineTriggers: [
    {
      id: 'BA Art Geas',
      regex: /Legendary Geas/,
      beforeSeconds: 0,
      infoText: {
        en: 'Stop Moving',
        de: 'Stehenbleiben',
        cn: '停止移动',
      },
    },
    {
      id: 'BA Raiden Levinwhorl',
      regex: /Levinwhorl/,
      regexDe: /Wirbelsturm/,
      beforeSeconds: 10,
      alertText: {
        en: 'Shields and Mitigation',
        de: 'Schilde und Abschwächungen',
        cn: '开盾减伤',
      },
    },
    {
      id: 'BA AV Eurekan Potion',
      regex: /Explosive Impulse/,
      regexDe: /Explosiver Impuls/,
      beforeSeconds: 10,
      suppressSeconds: 60,
      infoText: {
        en: 'Pop Eurekan Potions',
        de: 'Eureka-Heiltränke benutzen',
        cn: '磕优雷卡回复药',
      },
    },
    {
      id: 'BA Ozma Black Hole Warning',
      regex: /Black Hole/,
      regexDe: /Schwarzes Loch/,
      beforeSeconds: 12,
      infoText: {
        en: 'Black Hole Soon',
        de: 'Schwarzes Loch',
        cn: '黑洞警告',
      },
    },
  ],
  triggers: [
    {
      id: 'Eureka Hydatos Falling Asleep',
      regex: /00:0039:5 minutes have elapsed since your last activity./,
      regexCn: /00:0039:已经5分钟没有进行任何操作/,
      regexDe: /00:0039:Seit deiner letzten Aktivität sind 5 Minuten vergangen./,
      regexFr: /00:0039:Votre personnage est inactif depuis 5 minutes/,
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'REVEILLES TOI',
        cn: '醒醒！动一动！！',
      },
    },
    {
      id: 'Eureka Saved By Rememberance',
      regex: /00:0a39:The memories of heroes past live on again/,
      regexCn: /00:0a39:发动了英杰的加护效果，重新苏醒了过来/,
      regexDe: /00:0a39:Das Vermächtnis vergangener Helden lebt von Neuem auf!/,
      sound: 'Long',
    },
    {
      id: 'BA Seal',
      regex: /00:0839:.*will be sealed off/,
      regexCn: /00:0839:距.*被封锁还有/,
      regexDe: /00:0839:.*bis sich der Zugang/,
      run: function(data) {
        data.sealed = true;
      },
    },
    {
      id: 'BA Clear Data',
      regex: /00:0839:.*is no longer sealed/,
      regexCn: /00:0839:.*的封锁解除了/,
      regexDe: /00:0839:.*öffnet sich wieder/,
      run: function(data) {
        delete data.side;
        delete data.mythcall;
        delete data.clones;
        delete data.bracelets;
        delete data.sealed;
        delete data.blackHoleCount;
        delete data.seenHostile;
      },
    },
    {
      id: 'BA West Side',
      regex: / 15:\y{ObjectId}:Art:3956:[^:]*:\y{ObjectId}:[^:]/,
      suppressSeconds: 1000,
      run: function(data) {
        data.side = 'west';
      },
    },
    {
      id: 'BA East Side',
      regex: / 15:\y{ObjectId}:Owain:3957:[^:]*:\y{ObjectId}:[^:]/,
      suppressSeconds: 1000,
      run: function(data) {
        data.side = 'east';
      },
    },
    {
      id: 'BA Art Mythcall',
      regex: / 14:3927:Art starts using (?:Mythcall|Unknown_3927)/,
      regexDe: / 14:3927:Art starts using (?:Mythenruf|Unknown_3927)/,
      condition: function(data) {
        return data.side == 'west';
      },
      run: function(data) {
        data.mythcall = true;
      },
    },
    {
      id: 'BA Art Tankbuster',
      regex: / 14:3934:Art starts using (?:Thricecull|Unknown_3934) on (\y{Name})/,
      regexDe: / 14:3934:Art starts using (?:Dreifachlanze|Unknown_3934) on (\y{Name})/,
      condition: function(data) {
        return data.side == 'west';
      },
      alarmText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑减伤',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            cn: '死刑打' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            cn: '死刑',
          };
        }
      },
    },
    {
      id: 'BA Art Orb Marker',
      regex: / 1B:........:(\y{Name}):....:....:005C:/,
      condition: function(data) {
        return data.side == 'west';
      },
      alarmText: function(data, matches) {
        if (data.me != matches[1])
          return;
        return {
          en: 'Orb on YOU',
          cn: '被点名',
        };
      },
      alertText: function(data, matches) {
        if (data.me == matches[1])
          return;
        return {
          en: 'Away From Orb Marker',
          de: 'Weg von Orb-Marker',
          cn: '远离点名',
        };
      },
    },
    {
      id: 'BA Art Piercing Dark Marker',
      regex: / 1B:........:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.side == 'west' && data.me == matches[1];
      },
      alertText: {
        en: 'Spread Marker',
        de: 'Marker verteilen',
        cn: '点名分散',
      },
    },
    {
      id: 'BA Art Legendcarver',
      regex: / 14:3928:Art starts using (?:Legendcarver|Unknown_3928)/,
      regexDe: / 14:3928:Art starts using (?:Legendenschnitzer|Unknown_3928)/,
      condition: function(data) {
        return data.side == 'west';
      },
      infoText: {
        en: 'Out',
        de: 'Raus',
        cn: '远离',
      },
    },
    {
      id: 'BA Art Legendspinner',
      regex: / 14:3929:Art starts using (?:Legendspinner|Unknown_3929)/,
      regexDe: / 14:3929:Art starts using (?:Legendenspinner|Unknown_3929)/,
      condition: function(data) {
        return data.side == 'west';
      },
      infoText: {
        en: 'In',
        de: 'Rein',
        cn: '靠近',
      },
    },
    {
      id: 'BA Art Mythcall Legendcarver',
      regex: / 14:3928:Art starts using (?:Legendcarver|Unknown_3928)/,
      regexDe: / 14:3928:Art starts using (?:Legendenschnitzer|Unknown_3928)/,
      condition: function(data) {
        return data.side == 'west' && data.mythcall;
      },
      delaySeconds: 3.5,
      infoText: {
        en: 'Under Boss',
        de: 'Unter Boss',
        cn: 'Boss脚下',
      },
    },
    {
      id: 'BA Art Mythcall Legendspinner',
      regex: / 14:3929:Art starts using (?:Legendspinner|Unknown_3929)/,
      regexDe: / 14:3929:Art starts using (?:Legendenspinner|Unknown_3929)/,
      condition: function(data) {
        return data.side == 'west' && data.mythcall;
      },
      delaySeconds: 3.5,
      infoText: {
        en: 'Under Spears',
        de: 'Unter Speere',
        cn: '枪脚下',
      },
    },
    {
      id: 'BA Owain Tankbuster',
      regex: / 14:3945:Owain starts using (?:Thricecull|Unknown_3945) on (\y{Name})/,
      regexDe: / 14:3945:Owain starts using (?:Dreifachlanze|Unknown_3945) on (\y{Name})/,
      condition: function(data) {
        return data.side == 'west';
      },
      alarmText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑减伤',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            cn: '死刑打 ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            cn: '死刑',
          };
        }
      },
    },
    {
      id: 'BA Owain Piercing Light Marker',
      regex: / 1B:........:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches[1];
      },
      infoText: {
        en: 'Spread Marker',
        de: 'Marker verteilen',
        cn: '点名分散',
      },
    },
    {
      id: 'BA Owain Dorito Stack',
      regex: / 1B:........:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches[1];
      },
      alarmText: {
        en: 'Dorito Stack',
        de: 'Dorito Stack',
        cn: '点名集合',
      },
    },
    {
      id: 'BA Owain Fire Element',
      regex: / 00:0044:Munderg, turn flesh to ash/,
      regexDe: / 00:0044:Munderg, entfessele den Flammeneid/,
      condition: function(data, matches) {
        return data.side == 'east';
      },
      alertText: {
        en: 'Get to Ice',
        de: 'Geh zum Eis',
        cn: '冰',
      },
      infoText: {
        en: 'Switch Magia',
        de: 'Magia-Brett drehen',
        cn: '切换元素板',
      },
    },
    {
      id: 'BA Owain Ice Element',
      regex: / 00:0044:Munderg, turn blood to ice/,
      regexDe: / 00:0044:Munderg, das Eis der Ewigkeit soll sie für Äonen bannen/,
      condition: function(data, matches) {
        return data.side == 'east';
      },
      alertText: {
        en: 'Get to Fire',
        de: 'Geh zum Feuer',
        cn: '火',
      },
      infoText: {
        en: 'Switch Magia',
        de: 'Magia-Brett drehen',
        cn: '切换元素板',
      },
    },
    {
      id: 'BA Owain Ivory Palm',
      regex: / 16:\y{ObjectId}:Ivory Palm:3941:[^:]*:y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches[1];
      },
      alarmText: {
        en: 'Dorito Stack',
        de: 'Dorito Stack',
        en: 'Dorito Stack',
        cn: '点名集合',
      },
    },
    {
      id: 'BA Owain Pitfall',
      regex: / 14:394D:Owain starts using (?:Pitfall|Unknown_394D)/,
      regexDe: / 14:394D:Owain starts using (?:Berstender Boden|Unknown_394D)/,
      condition: function(data) {
        return data.side == 'east';
      },
      alertText: {
        en: 'Get Out To Edges',
        de: 'An den Rand',
        cn: '靠近边',
      },
    },
    {
      id: 'BA Silence Centaur',
      regex: / 14:3BFE:Arsenal Centaur starts using (?:Berserk|Unknown_3Bfe)/,
      regexDe: / 14:3BFE:Arsenal-Zentaur starts using (?:Berserker|Unknown_3Bfe)/,
      condition: function(data) {
        return data.job == 'WHM' || data.job == 'BLM';
      },
      alertText: {
        en: 'Sleep Centaur',
        de: 'Zentaur einschläfern',
        cn: '沉默人马',
      },
    },
    {
      id: 'BA Raiden Tankbuster',
      regex: / 14:387B:Raiden starts using (?:Shingan|Unknown_387B) on (\y{Name})/,
      regexDe: / 14:387B:Raiden starts using (?:Betäubungsschlag|Unknown_387B) on (\y{Name})/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑减伤',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            cn: '死刑打' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            cn: '死刑',
          };
        }
      },
    },
    {
      id: 'BA Raiden Lancing Bolt',
      regex: / 1B:........:(\y{Name}):....:....:008A:/,
      condition: function(data, matches) {
        return data.sealed && data.me == matches[1];
      },
      alarmText: {
        en: 'Spread',
        de: 'Verteilen',
        cn: '分散',
      },
    },
    {
      id: 'BA Raiden Ame',
      regex: / 14:3868:Raiden starts using/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Get Far Away',
        de: 'Weit weg gehen',
        cn: '远离',
      },
    },
    {
      id: 'BA Raiden Whirling',
      regex: / 14:386A:Raiden starts using (?:Whirling Zantetsuken|Unknown_386A)/,
      regexDe: / 14:386A:Raiden starts using (?:Sen-Zantetsuken|Unknown_386A)/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Under',
        de: 'Drunter',
        cn: '脚下',
      },
    },
    {
      id: 'BA Raiden For Honor',
      regex: / 14:387C:Raiden starts using (?:For Honor|Unknown_387C)/,
      regexDe: / 14:387C:Raiden starts using (?:Hieb der Gefallenen|Unknown_387C)/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Get Out',
        de: 'Raus da',
        cn: '远离',
      },
    },
    {
      id: 'BA Raiden Lateral 1',
      regex: / 14:386C:Raiden starts using (?:Lateral Zantetsuken|Unknown_386C) on (\y{Name})/,
      regexDe: / 14:386C:Raiden starts using (?:Kata-Zantetsuken|Unknown_386C) on (\y{Name})/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'LEFT',
        de: 'LINKS',
        cn: '左',
      },
    },
    {
      id: 'BA Raiden Lateral 2',
      regex: / 14:386B:Raiden starts using (?:Lateral Zantetsuken|Unknown_386B) on (\y{Name})/,
      regexDe: / 14:386B:Raiden starts using (?:Kata-Zantetsuken|Unknown_386B) on (\y{Name})/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'RIGHT',
        de: 'RECHTS',
        cn: '右',
      },
    },
    {
      id: 'BA AV Tankbuster',
      regex: / 14:379A:Absolute Virtue starts using (?:Auroral Wind|Unknown_379A) on (\y{Name})/,
      regexDe: / 14:379A:Absolute Tugend starts using (?:Aurorawind|Unknown_379A) on (\y{Name})/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data, matches) {
        if (matches[1] != data.me)
          return;
        return {
          en: 'Tank Buster on YOU',
          de: 'Tankbuster auf DIR',
          fr: 'Tankbuster sur VOUS',
          cn: '死刑减伤',
        };
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        return {
          en: 'Away from ' + data.ShortName(matches[1]),
          de: 'Weg von ' + data.ShortName(matches[1]),
          cn: '远离' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'BA AV Eidos Dark Bracelets',
      regex: /14:3787:Absolute Virtue starts using (?:Eidos|Unknown_3787)/,
      regexDe: /14:3787:Absolute Tugend starts using (?:Sarva|Unknown_3787)/,
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Dark Bracelets',
        de: 'Dunkle Armreife',
        cn: '黑光环',
      },
      run: function(data) {
        data.bracelets = 'dark';
      },
    },
    {
      id: 'BA AV Eidos Light Bracelets',
      regex: /14:3786:Absolute Virtue starts using (?:Eidos|Unknown_3786)/,
      regexDe: /14:3786:Absolute Tugend starts using (?:Sarva|Unknown_3786)/,
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Light Bracelets',
        de: 'Helle Armreife',
        cn: '白光环',
      },
      run: function(data) {
        data.bracelets = 'light';
      },
    },
    {
      id: 'BA AV Eidos Hostile Aspect',
      regex: /14:378B:Absolute Virtue starts using (?:Hostile Aspect|Unknown_378B)/,
      regexDe: /14:378B:Absolute Tugend starts using (?:Polarisierte Welle|Unknown_378B)/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data) {
        if (!data.seenHostile) {
          if (data.bracelets == 'light') {
            return {
              en: 'Away From Light Circles',
              de: 'Weg von hellen Kreisen',
              cn: '远离白圈',
            };
          }
          if (data.bracelets == 'dark') {
            return {
              en: 'Away From Dark Circles',
              de: 'Weg von dunklen Kreisen',
              cn: '远离黑圈',
            };
          }
          return;
        }
        if (data.bracelets == 'light') {
          return {
            en: 'Stand By Dark Circles',
            de: 'Zu den dunklen Kreisen',
            cn: '靠近黑圈',
          };
        }
        if (data.bracelets == 'dark') {
          return {
            en: 'Stand By Light Circles',
            de: 'zu den hellen Kreisen',
            cn: '靠近白圈',
          };
        }
      },
      run: function(data) {
        data.seenHostile = true;
      },
    },
    {
      id: 'BA AV Eidos Impact Stream',
      regex: /14:3788:Absolute Virtue starts using (?:Impact Stream|Unknown_3788)/,
      regexDe: /14:3788:Absolute Tugend starts using (?:Durchschlagsstrom|Unknown_3788)/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data) {
        if (data.bracelets == 'light') {
          return {
            en: 'Dark',
            de: 'Dunkel',
            cn: '黑',
          };
        }
        if (data.bracelets == 'dark') {
          return {
            en: 'Light',
            de: 'Hell',
            cn: '白',
          };
        }
      },
    },
    {
      id: 'BA AV Eidos Relative Virtue Colors',
      regex: /00:332e:Relative Virtue gains the effect of (Astral|Umbral) Essence/,
      regexDe: /00:332e:Relative Tugend gains the effect of Arm (des Lichts|der Dunkelheit)/,
      condition: function(data) {
        return data.sealed;
      },
      run: function(data, matches) {
        // RV clones get buffs in the reverse order that they do their attacks in.
        data.clones = data.clones || [];
        data.clones.push(matches[1]);
      },
    },
    {
      id: 'BA AV Triple Impact Stream',
      regex: /14:3797:Absolute Virtue starts using/,
      regexDe: /14:3797:Absolute Tugend starts using/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data, matches) {
        if (!data.clones)
          return;
        let wrists = data.clones.pop();
        if (wrists == 'Astral') {
          return {
            en: 'Dark',
            de: 'Dunkel',
            cn: '黑',
          };
        }
        if (wrists == 'Umbral') {
          return {
            en: 'Light',
            de: 'Hell',
            cn: '白',
          };
        }
      },
    },
    {
      id: 'BA AV Eidos Turbulent Aether',
      regex: /15:\y{ObjectId}:Absolute Virtue:3790:/,
      regexDe: /15:\y{ObjectId}:Absolute Tugend:3790:/,
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Orbs to Opposite Colors',
        de: 'Kugeln zu umgekehrter Farbe',
        cn: '连线去相反颜色',
      },
    },
    {
      id: 'BA AV Call Wyvern',
      regex: /15:\y{ObjectId}:Absolute Virtue:3798:/,
      regexDe: /15:\y{ObjectId}:Absolute Tugend:3798:/,
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Kill Wyverns, Switch Magia',
        de: 'Wyvern töten, Magia wechseln',
        cn: '杀龙，切换元素板',
      },
    },
    {
      id: 'BA Ozma Sphere Form',
      regex: /:Proto Ozma:(?:37B3|37A5|379F):/,
      regexDe: /:Proto-Yadis:(?:37B3|37A5|379F):/,
      condition: function(data) {
        return data.sealed;
      },
      preRun: function(data) {
        data.blackHoleCount = data.blackHoleCount || 0;
        data.blackHoleCount++;
      },
      alarmText: function(data) {
        return {
          en: 'Black Hole ' + data.blackHoleCount + ' / 6',
          cn: '黑洞 ' + data.blackHoleCount + ' / 6',
        };
      },
      tts: function(data) {
        return {
          en: 'Black Hole ' + data.blackHoleCount,
          cn: '黑洞 ' + data.blackHoleCount,
        };
      },
    },
    // FIXME: on all these forms, most of the time they come with double mechanics,
    // so probably need some "Then," text so folks don't leave the first mechanic early.
    // FIXME: random shade mechanic mid ozma form comes with holy/acceleration bomb/knockback
    // so call out something like "get off + holy" or "get knocked in".
    // FIXME: need callouts for knockback, and maybe "holy soon"?
    {
      id: 'BA Ozma Pyramid Form',
      regex: /:Proto Ozma:37A4:/,
      regexDe: /:Proto-Yadis:37A4:/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Off the Platform',
        de: 'Weg von der Fläche',
        cn: '远离平台',
      },
    },
    {
      id: 'BA Ozma Pyramid Form 2',
      regex: /:Proto Ozma:37A4:/,
      regexDe: /:Proto-Yadis:37A4:/,
      delaySeconds: 9,
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Spread for Bleed',
        de: 'Blutung verteilen',
        cn: '分散',
      },
    },
    {
      id: 'BA Ozma Star Form',
      regex: /:Proto Ozma:37B2:/,
      regexDe: /:Proto-Yadis:37B2:/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Go Far',
        de: 'Weit weg',
        cn: '远离',
      },
    },
    {
      id: 'BA Ozma Star Form 2',
      regex: /:Proto Ozma:37B2:/,
      regexDe: /:Proto-Yadis:37B2:/,
      delaySeconds: 9,
      condition: function(data) {
        return data.sealed;
      },
      infoText: function(data) {
        // FIXME: taking multiple autos probably means tanking,
        // so probably could figure this out automatically.
        if (data.role == 'tank') {
          return {
            en: 'Stack (if not tanking)',
            de: 'Stack (wenn nicht am tanken)',
            cn: '集合（如果没在坦怪）',
          };
        }
        return {
          en: 'Stack Up',
          de: 'Stacken',
          cn: '集合',
        };
      },
    },
    {
      id: 'BA Ozma Cube Form',
      regex: /:Proto Ozma:379E:/,
      regexDe: /:Proto-Yadis:379E:/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Get Close',
        de: 'Nah dran',
        cn: '靠近',
      },
    },
    {
      id: 'BA Ozma Cube Form 2',
      regex: /:Proto Ozma:379E:/,
      regexDe: /:Proto-Yadis:379E:/,
      delaySeconds: 9,
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data) {
        // FIXME: taking multiple autos probably means tanking,
        // so probably could figure this out automatically.
        if (data.role == 'tank') {
          return {
            en: 'Offtanks Get Orbs',
            de: 'Offtanks holt Kugeln',
            cn: 'ST接线',
          };
        }
      },
      infoText: function(data) {
        if (data.role != 'tank') {
          return {
            en: 'Stack Away From Tank',
            de: 'Weg vom Tank stacken',
            cn: '远离坦克集合',
          };
        }
      },
    },
    {
      id: 'BA Ozma Pyramid Shade',
      regex: /:(?:Ozmashade|Shadow):37A4:/,
      regexDe: /:Yadis-Schatten:37A4:/,
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Get Off',
        de: 'Weg da',
        cn: '远离平台',
      },
    },
    {
      id: 'BA Ozma Star Shade',
      regex: /:(?:Ozmashade|Shadow):37B2:/,
      regexDe: /:Yadis-Schatten:37B2:/,
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Get Close',
        de: 'Nah dran',
        cn: '靠近',
      },
    },
    {
      id: 'BA Ozma Cube Shade',
      regex: /:(?:Ozmashade|Shadow):379E:/,
      regexDe: /:Yadis-Schatten:379E:/,
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Go Far',
        de: 'Weit weg',
        cn: '远离',
      },
    },
    {
      id: 'BA Ozma Adds',
      regex: /:Cloudlarker:37B0:/,
      regexDe: /:Wolkenlauerer:37B0:/,
      delaySeconds: 2,
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Kill Adds',
        de: 'Adds töten',
        cn: '杀小怪',
      },
    },
    {
      id: 'BA Ozma Acceleration Bomb',
      regex: / 16:\y{ObjectId}:Proto Ozma:37AA:[^:]*:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 16:\y{ObjectId}:Proto-Yadis:37AA:[^:]*:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.sealed && data.me == matches[1];
      },
      alarmText: {
        en: 'Stop Soon',
        de: 'Bald stoppen',
        cn: '注意停手',
      },
    },
    {
      id: 'BA Ozma Meteor',
      regex: / 1B:........:(\y{Name}):....:....:0039:/,
      condition: function(data, matches) {
        return data.sealed && data.me == matches[1];
      },
      alarmText: {
        en: 'Meteor on YOU',
        de: 'Meteor auf DIR',
        cn: '陨石点名',
      },
    },
  ],
  timelineReplace: [
    {
      "locale": "cn",
      "replaceSync": {
        "Art": "",
        "Owain": "",
        "Arsenal Centaur": "",
        "Raiden": "",
        "Absolute Virtue": "",
        "Relative Virtue": "",
        "Wyverns": "",
        "Proto Ozma": "",
      },
      "replaceText": {
        "Mythcall": "",
        "Thricecull": "",
        "Legendcarver": "",
        "Legendspinner": "",
        "Thricecull": "",
        "Ivory Palm": "",
        "Pitfall": "",
        "Shingan": "",
        "Berserk": "",
        "Whirling Zantetsuken": "",
        "For Honor": "",
        "Lateral Zantetsuken": "",
        "Auroral Wind": "",
        "Eidos": "",
        "Hostile Aspect": "",
        "Impact Stream": "",
        // FIXME:
        "(Astral|Umbral) Essence": "",
      },
      "~effectNames": {
      }
    },
  ],
}];
