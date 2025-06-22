import { getFormattedString } from "../../base/string";
import { Quest, QuestItem, HydratedQuest, QuestSummary } from "../../services/quest_service";

export type QuestWithCategory = QuestSummary & {
  category: string,
}

export type QuestDetail = {
  id: number,
  name?: string,
  type?: string,
  blocked?: boolean,
  text: {
    available?: string,
    inProgress?: string,
    completed?: string,
  },
  prerequisites: {
    level?: number,
    quests: number[],
  },
  inProgress: {
    items: QuestItem[],
  }
  complete: {
    items: QuestItem[],
  },
  startingNpc?: number,
};

export const mapQuest = (img: string, quest: Quest): QuestDetail => {
  return {
    id: Number(img.slice(0, -4)),
    name: quest.QuestInfo.name,
    type: quest.QuestInfo.type,
    blocked: quest.QuestInfo.blocked === 1,
    text: {
      available: quest.QuestInfo['0'],
      inProgress: quest.QuestInfo['1'],
      completed: quest.QuestInfo['2'],
    },
    prerequisites: {
      level: quest.Check['0']?.lvmin,
      quests: Object.values(quest.Check['0']?.quest ?? {}).map(q => q.id),
    },
    inProgress: {
      items: quest.Check['1']?.item ? Object.values(quest.Check['1']?.item).map(i => ({
        id: i.id,
        count: i.count,
        order: i.order,
      })) : [],
    },
    complete: {
      items: quest.Act['1']?.item ? Object.values(quest.Act['1']?.item).map(i => ({
        id: i.id,
        count: i.count,
        order: i.order,
      })) : [],
    },
    startingNpc: quest.Check['0']?.npc,
  }
}

export const mapLuaQuestDetailTemplate = (quests: HydratedQuest[]): string => {
  return `
return {
  ${quests.map(q => `  ['${q.questDetail.id}'] = {
    avail = '${getFormattedString(q.questDetail.text.available ?? '', q.stringParams, 'wikitext').replace(/'/g, "\\'")}',
    prog  = '${getFormattedString(q.questDetail.text.inProgress ?? '', q.stringParams, 'wikitext').replace(/'/g, "\\'")}',
    comp  = '${getFormattedString(q.questDetail.text.completed ?? '', q.stringParams, 'wikitext').replace(/'/g, "\\'")}',
  }`).join(',\n')}
}`;
};

export const copyQuestLink = (quest?: string) => {
  const wikitextQuest = quest?.replace(/\[/g, '(').replace(/\]/g, ')');
  navigator.clipboard.writeText(`[[Quest/${wikitextQuest}|${quest}]]`);
}

export const getQuestPageWikitext = (quest: HydratedQuest, questCategory: string) => {
  return `{{DISPLAYTITLE|${quest.questDetail.name}}}
<!--${quest.questDetail.id}-->
{{Infobox quest
|name=${quest.questDetail.name}
|npcimg=${quest.questDetail.startingNpc ? `NPC ${quest.stringParams.npcs[quest.questDetail.startingNpc]}.png` : ''}
|npc=${quest.questDetail.startingNpc ? `[[${quest.stringParams.npcs[quest.questDetail.startingNpc]}]]` : 'Self'}
|category=${questCategory}
|type={{Quest Type|0-1}}
|repeat=
|kmsName=
|jmsName=
|cmsName=
|tmsName=
|seaName=
}}
Add description

==Pre-requisites==
*To have SOME QUEST completed
${quest.questDetail.prerequisites.level ? `*At least Level ${quest.questDetail.prerequisites.level}` : ''}

==Procedure==
#TODO

==Rewards==
[[File:basicReward.png|link=|You will receive]]<br/>{{Quest Rewards}}

==Unlocked Quest(s)==
*TODO

==Details==
{{Quest Details|${questCategory}|id=${quest.questDetail.id}}}
`;
}