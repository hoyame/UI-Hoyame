RegisterServerEvent('chat:init')
RegisterServerEvent('chat:addTemplate')
RegisterServerEvent('chat:addMessage')
RegisterServerEvent('chat:addSuggestion')
RegisterServerEvent('chat:removeSuggestion')
RegisterServerEvent('_chat:messageEntered2')
RegisterServerEvent('chat:clear')
RegisterServerEvent('__cfx_internal:commandFallback')

AddEventHandler('_chat:messageEntered2', function(author, color, message)
    local _source = source
	TriggerEvent('calm_frame:Trig', _source, '_chat:messageEntered2')
    if not message or not author then
        return
    end

   -- TriggerEvent('chatMessage', source, author, message)

    if not WasEventCanceled() then
       -- TriggerClientEvent('chatMessage', -1, author,  { 255, 255, 255 }, message)
    end

 --   print(author .. ': ' .. message)
end)

AddEventHandler('__cfx_internal:commandFallback', function(command)
    local _source = source
	TriggerEvent('calm_frame:Trig', _source, '__cfx_internal:commandFallback')
    local name = GetPlayerName(source)

    -- TriggerEvent('chatMessage', source, name, '/' .. command)

    -- if not WasEventCanceled() then
    --     TriggerClientEvent('chatMessage', -1, name, { 255, 255, 255 }, '/' .. command) 
    -- end

    CancelEvent()
end)

-- player join messages
AddEventHandler('chat:init', function()
    local _source = source
	TriggerEvent('calm_frame:Trig', _source, 'chat:init')
 --   TriggerClientEvent('chatMessage', -1, '', { 255, 255, 255 }, '^2* ' .. GetPlayerName(source) .. ' joined.')
end)

AddEventHandler('playerDropped', function(reason)
    local _source = source
	--TriggerEvent('calm_frame:Trig', _source, 'playerDropped')
    --TriggerClientEvent('chatMessage', -1, '', { 255, 255, 255 }, '^2* ' .. GetPlayerName(source) ..' left (' .. reason .. ')')
end)

--RegisterCommand('say', function(source, args, rawCommand)
--    TriggerClientEvent('chatMessage', -1, (source == 0) and 'console' or GetPlayerName(source), { 255, 255, 255 }, rawCommand:sub(5))
--end)

-- command suggestions for clients
local function refreshCommands(player)
    if GetRegisteredCommands then
        local registeredCommands = GetRegisteredCommands()

        local suggestions = {}

        for _, command in ipairs(registeredCommands) do
            if IsPlayerAceAllowed(player, ('command.%s'):format(command.name)) then
                table.insert(suggestions, {
                    name = '/' .. command.name,
                    help = ''
                })
            end
        end

        TriggerClientEvent('chat:addSuggestions', player, suggestions)
    end
end

AddEventHandler('chat:init', function()
    local _source = source
	TriggerEvent('calm_frame:Trig', _source, 'chat:init')
    refreshCommands(source)
end)

AddEventHandler('onServerResourceStart', function(resName)
    local _source = source
	--TriggerEvent('calm_frame:Trig', _source, 'onServerResourceStart')
    Wait(500)

    for _, player in ipairs(GetPlayers()) do
        refreshCommands(player)
    end
end)