import Nav from '../component/Home/Header';
import Banner from '../component/Home/Banner';
import Category from '../component/Home/Category';
import Hotsale from '../component/Home/Hotsale';
import Banner2 from '../component/Home/Banner/index2';
import ProductTable from '../component/Home/Product';
import Banner3 from '../component/Home/Banner/index3';
import Footer from '../component/Home/Footer';

function Home() {
  return (
    <div>
      <Banner />
      <Category />
      <Hotsale />
      <Banner2 />
      <ProductTable />
      <Banner3 />
      <Footer />
    </div>
  );
}

export default Home;
