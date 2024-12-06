import IcHighHeels from "../assets/ic_high_heels.png";
import IcLeatherShoes from "../assets/ic_leather_shoes.png";
import IcBadmintonShoes from "../assets/ic_badminton_shoe.png";
import IcFlatShoes from "../assets/ic_ballet_flats.png";
import IcSandal from "../assets/ic_sandal.png";
import IcBoots from "../assets/ic_boots.png";
import IcFlipFlops from "../assets/ic_flip_flops.png";
import IcRunningShoes from "../assets/ic_running_shoes.png";
import IcSportKidShoes from "../assets/ic_sport_kid_shoes.png";
import IcSoccerShoes from "../assets/ic_soccer_shoes.png";
const urlMap = {
    "giay-chay-bo-nam": "Giày chạy bộ nam",
    "giay-cau-long-nam": "Giày cầu lông nam",
    "giay-tay-nam": "Giày tây nam",
    "sandal-nam": "Sandal nam",
    "giay-da-bong-nam": "Giày đá bóng nam",
    "giay-chay-bo-nu": "Giày chạy bộ nữ",
    "giay-cau-long-nu": "Giày cầu lông nữ",
    "giay-cao-got": "Giày cao gót nữ",
    "giay-bup-be": "Giày búp bê nữ",
    "sandal-nu": "Sandal nữ",
    "boot-nu": "Boot nữ",
    "sandal-tre-em": "Sandal kid",
    "dep-tre-em": "Dép kid",
    "giay-the-thao-tre-em": "Giày thể thao kid",
};


export const navs = [
    { title: "Giày chạy bộ", link: "/collections/giay-chay-bo-nam", parent: 0, img: IcRunningShoes },
    { title: "Giày cầu lông", link: "/collections/giay-cau-long-nam", parent: 0, img: IcBadmintonShoes },
    { title: "Giày tây", link: "/collections/giay-tay-nam", parent: 0, img: IcLeatherShoes },
    { title: "Giày đá bóng", link: "/collections/giay-da-bong-nam", parent: 0, img: IcSoccerShoes },
    { title: "Sandal", link: "/collections/sandal-nam", parent: 0, img: IcSandal },
    { title: "Giày chạy bộ", link: "/collections/giay-chay-bo-nu", parent: 1, img: IcRunningShoes },
    { title: "Giày cầu lông", link: "/collections/giay-cau-long-nu", parent: 1, img: IcBadmintonShoes },
    { title: "Giày cao gót", link: "/collections/giay-cao-got", parent: 1, img: IcHighHeels },
    { title: "Giày búp bê", link: "/collections/giay-bup-be", parent: 1, img: IcFlatShoes },
    { title: "Sandal", link: "/collections/sandal-nu", parent: 1, img: IcSandal },
    { title: "Boot", link: "/collections/boot-nu", parent: 1, img: IcBoots },
    { title: "Giày thể thao", link: "/collections/giay-the-thao-tre-em", parent: 2, img: IcSportKidShoes },
    { title: "Sandal", link: "/collections/sandal-tre-em", parent: 2, img: IcSandal },
    { title: "Dép", link: "/collections/dep-tre-em", parent: 2, img: IcFlipFlops },
];

function findParentNumByLink(link) {
    let nav = navs.find((nav) => nav.link === link);
    return nav?.parent;
}



export { urlMap, findParentNumByLink };
