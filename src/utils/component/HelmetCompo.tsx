import * as React from 'react';
import { Helmet } from 'react-helmet';


type MetaNameTypes = 'description' | 'keywords' | 'author' | 'viewport'
type HelmetMeta = {
    name: MetaNameTypes;
    content: string;
};
const HelmetCompo: React.SFC<{
    title: string;
    metas: HelmetMeta[];
}> = ({
    title,
    metas
}) => (
    <Helmet>
        <title>{title}</title>
        {metas.map(metaData => <meta key={metaData.name} {...metaData} />)}
    </Helmet>
);

export default HelmetCompo;
