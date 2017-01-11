> AiTing APP Document

### Introduction
AiTing is a simple and beautiful desktop application. We can listen a music from a default list or searched by ourself.
It support remote control if two equipments using a local area network. In setting one window, we can see all commands from other equipments.

### Working Flow

**Step 1:** Double click .exe program, it will be launched. 

**Step 2:** Then you can click one music from a default to play, or you can search one you like from search input of header. 

**Step 3:** Like other player, you can control current music by control section at the bottom of this app.

**Step 4:** You can view lyrics and music image from right section.

**Step 5:** When you click console, you can see a black window for check who is controlling you.

### UI Design

Please see **UI_design.png** in root folder.

### Backend Design

**Two Implements:**

1. Due to the specific remote design, We have to use to ways to run this app.First one no need backend support, jusk use electron to pack.Second one, before launch this app, need run a server first, it use to receive commands.
2. Launch app by electron first, then using npm module to run a server in the background, but this way is hard.

### Remote Design

**How to connet to client?**

**How to control?**