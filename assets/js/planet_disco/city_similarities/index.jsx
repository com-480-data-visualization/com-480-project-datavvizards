import React, { useEffect, useContext, useState } from 'react'
import * as d3 from 'd3'
import EmbeddingMap from './embedding_map'
import { FragmentWormhole } from '../common/wormhole'
import { StoreContext } from '../common/store'
import CityPanel from '../common/city_panel'
import CityLookup from '../common/city_lookup'

export default () => {
    const [data, setData] = useState(null)
    const { state: { city, wormholes: { panel, sidebar } }, dispatch } = useContext(StoreContext)

    useEffect(() => {
        d3.csv("/data/embedding_cities.csv").then((new_data) => {
            setData(new_data)
        })
    }, [])

    return (
        <React.Fragment>
            {sidebar && <FragmentWormhole to={sidebar}>
                {!city && <CityLookup />}
                {city && <CityPanel city={city} />}
            </FragmentWormhole>}

            {data &&
                <EmbeddingMap data={data} />}
        </React.Fragment>
    )
}