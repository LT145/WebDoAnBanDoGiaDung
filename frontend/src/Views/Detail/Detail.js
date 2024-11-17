import Nav_mini from "../../component/Detail/Nav_mini";
import Product from "../../component/Detail/NameProduct";
import Nav from "../../component/Home/Header";
import BoxProduct from "../../component/Detail/BoxProduct";
import CamKet from "../../component/Detail/CamKet";
import BoxRight from "../../component/Detail/BoxRight";
import BoxInfo from "../../component/Detail/BoxInfo";
import Footer from "../../component/Home/Footer";
import BoxFB from "../../component/Detail/BoxFB";
import './Detail.css'

function Detail(){
    return(
        <div>
            <Nav_mini />
            <Product />
            <div style={{display:'flex', width:'1150px', gap:'15px',margin:'0px auto', minWidth:'1150px'}}>
                <div>
                    <BoxProduct />
                    <CamKet />
                    <BoxInfo />
                    <BoxFB />
                </div>
                <BoxRight />
                
            </div>
            <Footer />
        </div>
    );
}
export default Detail