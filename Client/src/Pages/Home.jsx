import React from 'react'
import Banner from './Home/Banner'
import Deals from './Home/Deals'
import HighestRatings from './Home/HighestRatings'
import StartOrdering from './Home/StartOrdering'
import PartnerSignup from './Home/PartnerSignup'
import DeliveryStats from './Home/DeliveryStats'

export default function Home() {
    return (
        <div class="Home">
            <Banner />
            <HighestRatings />
            <StartOrdering />
            <PartnerSignup />
            <DeliveryStats />
        </div>

    )
}

