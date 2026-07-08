# mf-tool-002 outcome reference

Stable IDs for agent workflows. Map in `rules.json` → `decision_tree` for readable flow.

## human_only

AI must not own the outcome. Human sends or decides.

**Do:** scripts, checklists, private AI notes only.  
**Do not:** auto-send, auto-reply, AI-signed promises.

## template_first

Same message shape every time. AI fills slots only.

**Do:** canonical ack/script, spot-check first 10, then optional slot-fill API.  
**See:** mf-tpl-001 for customer comms.

## llm_assist

AI drafts; human reviews and ships.

**Do:** one-shot or chat, edit for voice and facts, save good examples.  
**Do not:** unattended customer-facing sends.

## llm_api

Stable structured pipeline (cron, webhook, batch).

**Do:** cap tokens/cost, sample rows first, alert on failures.  
**See:** mf-train-001.

## agent_workflow

Multi-step: research, fetch, compare, draft.

**Do:** explicit step list, human approves plan and numbers.  
**Do not:** one mega-prompt for complex deliverables.

## gather_data_first

Volume or failure cost unknown.

**Do:** 30-90 day log, re-run rubric.  
**See:** mf-tool-001 after data exists.

## not_ai

Sheet, calendar, checklist enough.

**Do:** manual or formula first.  
**See:** mf-tool-001 if volume rises.