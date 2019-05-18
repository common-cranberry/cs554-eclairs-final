
# CS554 final

This project is managed by `pnpm`.

To install `pnpm`
---

`npm install -g pnpm`

To install the project (from root)
---

`pnpm install -r`

To build the project (from root)
---

`pnpm recursive run build`

To run the project (from root)
---

`pnpm recursive run debug`

# Eclairs: Life Blogging Site

Our website is a week-based life chronicling application that allows users to  keep track of life events in a visually appealing and simple format. The user's life of ~100 years is represented week by week per year in a timeline of weeks from the first week of the user's birth to the final week. Each week is clickable, allowing users to add or edit events that happened during the week.

The main purpose of the site is to assist in life chronicling, providing the users with a simple, yet effective visual interface for monitoring life events. It can be used for self-improvement, tracking progress, such as towards a degree or losing weight, or sharing important life events with others.

Inspiration:

- https://waitbutwhy.com/2014/05/life-weeks.html
- http://digitolle.net/life/?fbclid=IwAR0u08uhGrMFMgOnZy-MGmDHLJ0PuLhdFDNjZ_WAfzjM3qdHrCxecxiONNM

By:
- Jeff McGirr
- Mitchell Freedman
- Chris Kelley
- Gregory Goldshteyn

## Changes from initial proposal

Originally, the site was designed around a grid system to chronical life events.

In testing, we found that the grid was not easy to use as an interface. Though it performed well for data abstraction purposes (giving a concise overview of the user's life), it was not easy to interact with when adding or editing life events.

Instead, we went with a timeline design that we found easier to use.

Additionally, socket.io was designed to send push notifications to users who have life events on the same week. Instead, these push notifications are visible to everyone on the site.

## Implementation

The site is broken into two parts, the api, which is a restful service dedicated to user authentication and data manipulation, and the app, which is the front end the user interacts with.

When a user interacts with the front end, a request is made to the restful back end, which in turn validates the user's request, and makes a request to a Mongodb database hosted on Azure. The data is then passed back to the api, which in turn, passes it to the app to present it to the user.

Additionally, the api and front end interface with each other using socket.io. When a user enters an event on the site, all other users on the site get a notification that the event has been added.

Vue / Veutify / Vuex were chosen for our framework due to team familiarity with the framework.

Mongodb was selected for NoSQL storage for easy storage and retrieval of json objects, including life events and user information.