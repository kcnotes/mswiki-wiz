-- <nowiki>
-- Builds all skill templates, based on json data

local Skills = {}
local getArgs = require('Module:Arguments').getArgs

function Skills.loadSkill(key, id)
	-- This json call is cached per-page
	local data = mw.loadJsonData('Module:Skills/' .. key .. '.json')
	if data == nil then
		return nil
	end
	-- loadJsonData converts the ID to a number https://phabricator.wikimedia.org/T355763
	if data.skills[tonumber(id)] ~= nil then
		return data.skills[tonumber(id)]
	end
	if data.skills[id] ~= nil then
		return data.skills[id]
	end
	return nil
end

-- Splits a non-Unicode string
function split(text, pattern, plain)
	local ret = {}
	local s, l = 1, text:len()
	while s do
		local e, n = text:find(pattern, s, plain)
		if not e then
			ret[#ret + 1] = text:sub(s)
			s = nil
		elseif n < e then
			-- Empty separator
			ret[#ret + 1] = text:sub(s, e)
			if e < l then
				s = e + 1
			else
				s = nil
			end
		else
			ret[#ret + 1] = e > s and text:sub(s, e - 1) or ''
			s = n + 1
		end
	end
	return ret
end

function splitAndTrim(input)
	local strs = split(input, ',', true)
	for i, str in ipairs(strs) do
		strs[i] = mw.text.trim(str)
	end
	return strs
end

function Skills.getElementAttributeLinks(elements)
	local ret = {}
	for _, element in ipairs(elements) do
		ret[#ret + 1] = '[[:Category:' .. element .. ' Skills|' .. element .. ']]'
	end
	return table.concat(ret, ', ')
end

-- Generates a detailed description of a skill, for use in individual skill pages
-- Includes the following attributes: skillName, skillClass, skillType, elementAttribute, maxLevel, levelRequirement, bgm, cutscene, cutscene2, combatOrders, vSkill
function Skills.getDetailedDescription(skill, args)
	local elementAttributes = skill['elementAttribute'] and splitAndTrim(skill['elementAttribute']) or nil
	local maxLevel = tonumber(skill['maxLevel']) or 0
	local combatOrders = (tonumber(skill['combatOrders']) or 0) > 0
	local vSkill = (tonumber(skill['vSkill']) or 0) > 0
	local cutscenes = args['cutscene']
		and (args['cutscene'] .. (args['cutscene2'] and '<br/>' .. args['cutscene2'] or ''))
		or nil
	local maxLevelWithAnnotation = combatOrders
		and '{{SkillProperties|CombatOrders|' .. maxLevel .. '}}'
		or vSkill
			and '{{SkillProperties|VSkill|' .. maxLevel .. '}}'
			or maxLevel

	local items = {
		{ label = 'Name', value = args['skillName'] or nil },
		{ label = 'Class', value = args['skillClass'] or nil },
		{ label = 'Type', value = skill.type or nil },
		{ label = 'Element Attribute', value = elementAttributes and Skills.getElementAttributeLinks(elementAttributes) or nil },
		{ label = 'Maximum Level', value = maxLevelWithAnnotation or nil },
		{ label = 'Level Requirement', value = skill.levelRequirement or nil },
		{ label = 'BGM', value = skill.bgm or nil },
		{ label = 'Activation cutscene', value =  cutscenes },
	}

	local list = mw.html.create('ul')
	for _, item in ipairs(items) do
		if item.value ~= nil then
			list:tag('li'):wikitext("'''" .. item.label .. "''': " .. tostring(item.value))
		end
	end
	return tostring(list)
end

function getLevelList(maxLevel, vSkill, combatOrders)
	if maxLevel ~= 1 then
		return vSkill 
			and {1, maxLevel, maxLevel + 5} 
			or combatOrders 
				and {1, maxLevel, maxLevel + 1, maxLevel + 2} 
				or {1, maxLevel}
	else
		return combatOrders 
			and {1, 2, 3}
			or {1}
	end
end

function getFullLevelList(maxLevel, vSkill, combatOrders)
	local realMaxLevel = vSkill 
		and maxLevel + 5 
		or combatOrders 
			and maxLevel + 2 
			or maxLevel
	local levelList = {}
	for i = 1, realMaxLevel do
		levelList[i] = i
	end
	return levelList
end

function Skills.addHeader(skill, table)
	table:tag('tr')
		:tag('th')
			:attr('colspan', 2)
			:wikitext(skill.description)
			:done()
		:done()
	table:tag('tr')
		:tag('th')
			:attr('width', '10%')
			:wikitext('Level')
			:done()
		:tag('th')
			:wikitext(skill.readout)
			:done()
		:done()
end

function Skills.getRows(skill, detailed)
	local frame = mw.getCurrentFrame()
	local maxLevel = tonumber(skill.maxLevel) or 0
	local combatOrders = (tonumber(skill.combatOrders) or 0) > 0
	local vSkill = (tonumber(skill.vSkill) or 0) > 0
	local levelList = detailed 
		and getFullLevelList(maxLevel, vSkill, combatOrders) 
		or getLevelList(maxLevel, vSkill, combatOrders)

	local table = mw.html.create('table')
	Skills.addHeader(skill, table)

	for _, i in ipairs(levelList) do
		local parsedFormula = skill.formula:gsub(
	        "{#expr:(.-)}",
	        function(expr)
	            return "{{#expr:" .. expr:gsub("x", tostring(i)) .. "}}"
	        end
	    )
		table:tag('tr')
			:tag('td'):wikitext(i)
			:tag('td'):wikitext(frame:preprocess(parsedFormula))
			:done()
	end
	table:done()
	return tostring(table)
end

function Skills.getDetailed(args)
	local id = args['id']
	local key = args['key']
	local skill = Skills.loadSkill(key, tonumber(id))

	if skill == nil then
		return 'Error: Skill not found'
	end

	return Skills.getDetailedDescription(skill, args) .. Skills.getRows(skill, true)
end

function Skills.detailed(frame)
    local args = getArgs(frame)
    return Skills.getDetailed(args)
end

return Skills
-- </nowiki>
