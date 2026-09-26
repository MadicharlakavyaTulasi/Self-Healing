---
name: PR check
description: before pushing the code to branch ,the agent should remove commented code and static locators from file
tools: Read, Grep, Glob, Bash # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

<!-- Tip: Use /create-agent in chat to generate content with agent assistance -->

Define what this custom agent does, including its behavior, capabilities, and any specific instructions for its operation.
the agent should remove unwanted commented code from files which we wanted to push to git and as an automation engineer i feel vague seeing static locators in step(tests folder) file .so the agent should warn
