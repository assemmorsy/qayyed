import { createMachine } from "xstate";

export const showMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5SwMYCcxgHawHQGUUB7DAYnwGEB5AJQFEB9ASQDkL6BBfOgEUVAAORWAEsALiKJZ+IAB6IAtAGYAbAEZcAVhUB2ACx6ATHqV6dalboA0IAJ6LDADiW4DSpToAMK9wE41hkoAvkE2qBjYeDxgYgCGIgA2kIQkYKQAYqxM+AASDDx0ACocTAAyvDJCohJSMvYICmouAY6OFo4+Tkpq-jbyCCp6uEqaJnqa3uaD7iFh6Jg4uNFxicnEZJS0jKzsdFwVSCBV4pLSh-0KllqBgSM6E4Oajjb1jY5Dap6eer66vp7vFSGTSzEDhBZ4ADqIiwWDAaAyWVyDEhrBYdBolWEJ1q50U-k0uB0viUjk8vkcmlJFjUL0QAQ0pn0mkCP0ManMjhCoRAWCIEDgMnBkQI6zAWOqpxkF2cnlw5IZHjJXh0dIahh0hlcHgBTWBOlUxlBwsWy3iSQgKQwEpxZ1AFyaLk0E3cSg19yBgTVjWaTjaKg6bucPTUxvmIuhsPhNpqdrkiiBKi0OucFMCOlVdnp42GZMcvyaozGKjDERwMaleIaJN8RJJZIpVP9tKzDRGhKMekTHIDbpUIO5QA */
    createMachine({
        id: "screens",
        initial: "Score",
        states: {
            Score: {
                on: {
                    SCORE_INCREASED: {
                        actions: [
                            "showScore"
                        ],
                        target: "DetailedScore",
                    },
                },
            },
            DetailedScore: {
                on: {
                    FINISH_DETAILED: [
                        {
                            cond: "hasWinner",
                            target: "Winner",
                        },
                        {
                            target: "Score",
                        },
                    ],
                    SCORE_INCREASED: {
                        target: "DetailedScore",
                        internal: false,
                    },
                },
            },
            Winner: {
                on: {
                    FINISH_WINNER: {
                        target: "Score",
                    },
                },
            },
        },
    },)