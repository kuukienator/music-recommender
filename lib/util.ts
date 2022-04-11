export enum JourneySteps {
    Loading = 'loading',
    Login = 'login',
    Start = 'start',
    ChooseTracks = 'chooseTracks',
    ChooseArtists = 'chooseArtists',
    ChooseGenres = 'chooseGenres',
    ShowRecommendations = 'showRecommendations',
}

export const isStepBeforeStart = (step: JourneySteps): boolean =>
    step === JourneySteps.Loading || step === JourneySteps.Login;

export const isStepBeforeChoosing = (step: JourneySteps): boolean =>
    step === JourneySteps.Loading ||
    step === JourneySteps.Login ||
    step === JourneySteps.Start;

export const scrollToTop = () => window.scrollTo(0, 0);

export const filterListByIds = <T extends { id: string }>(
    source: Array<T>,
    ids: Array<string>
): Array<T> =>
    ids.map((id) => source.find((e) => e.id === id)).filter((e): e is T => !!e);
