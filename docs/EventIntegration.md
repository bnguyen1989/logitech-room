# Event Integration

## Option Tracking

We want to fire off an event each time we present the user with a choice: Options_Show
Then we also want to fire off an event each time they make a choice: Option_Interaction

## Asset Loading

Asset loading events are built into the system.
These events should use the same sessionId. Fixed.

## Configurator Flow:

* GetStarted: Button, Button.
* Configurator: CardRoom 0 - 5.
* Configurator: CardPlatform 1, 2, 3
* Configurator: CardService 0, 1
* Review + Room Loading.

One almost wants to have a context like object where one can reset the context and then add items to it.
