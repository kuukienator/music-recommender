export const scrollToTop = () => window.scrollTo(0, 0);

export const filterListByIds = <T extends { id: string }>(
    source: Array<T>,
    ids: Array<string>
): Array<T> =>
    ids.map((id) => source.find((e) => e.id === id)).filter((e): e is T => !!e);
