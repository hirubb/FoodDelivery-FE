import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const DeliveryStats = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div
      ref={ref}
      className="bg-orange-500 py-6 px-4 md:px-12 rounded-lg w-full max-w-6xl mx-auto mb-[10%]"
    >
      <div className="flex flex-wrap justify-between items-center text-white text-center">
        {/* Stat Item */}
        <div className="w-1/2 sm:w-1/4 py-3 border-r border-white last:border-r-0">
          <h2 className="text-5xl font-bold">
            {inView ? <CountUp end={546} duration={2} /> : '546+'}
          </h2>
          <p className="text-xl mt-1 font-bold text-bl">Registered Riders</p>
        </div>

        <div className="w-1/2 sm:w-1/4 py-3 border-r border-white last:border-r-0">
          <h2 className="text-5xl font-bold">
            {inView ? <CountUp end={789900} duration={2} separator="," /> : '789,900+'}
          </h2>
          <p className="text-xl mt-1 font-bold">Orders Delivered</p>
        </div>

        <div className="w-1/2 sm:w-1/4 py-3 border-r border-white last:border-r-0">
          <h2 className="text-5xl font-bold">
            {inView ? <CountUp end={690} duration={2} /> : '690+'}
          </h2>
          <p className="text-xl mt-1 font-bold">Restaurants Partnered</p>
        </div>

        <div className="w-1/2 sm:w-1/4 py-3">
          <h2 className="text-5xl font-bold">
            {inView ? <CountUp end={17457} duration={2} separator="," /> : '17,457+'}
          </h2>
          <p className="text-xl mt-1 font-bold">Food Items</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStats;
