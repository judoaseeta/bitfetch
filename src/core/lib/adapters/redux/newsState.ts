import Feed from '../../entities/cryptoArticleFeed';
import Category from '../../entities/cryptoCategory';

export interface NewsReducer {
    feeds: Feed[];
    categories: Category[];
}
export const initialState: NewsReducer = {
    feeds: [],
    categories: []
};

