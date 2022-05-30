import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { responsiveHeight as rh, responsiveWidth as rw } from 'react-native-responsive-dimensions'
import Colors from '../../Global/Colors';
import FontSize from '../../Global/FontSizes';
import Styles from './FindRecipes.Styles';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MarkSvg from '../../Assets/Icons/MarkSvg.svg'
import ForwardSvg from '../../Assets/Icons/ForwardSvg.svg'
import { useIsFocused } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { firebase } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';


import FavouriteColorfull from '../../Assets/Icons/FavouriteColorfull.svg'
import { SafeAreaView } from 'react-native-safe-area-context';
export default function FindRecipes({ navigation, route }) {
    const isFocused = useIsFocused();
    const loginpersonid = firebase.auth().currentUser.email
    const firebaseobect = firestore().collection('Favourite')
     console.log("Last Screen Dat--------->", route?.params);

    const [recoed, setrecoed] = useState([])
    const [pushrecord, setpushrecord] = useState([])
    const [lastscreendata, setlastscreendata] = useState(route?.params)
    const [loader, setloader] = useState(false)
    const [muzamil, setmuzamil] = useState([])
    const [favoriteList, setFavoriteList] = useState([]);
    const [favouritedata, setfavouritedata] = useState([])

    // {
    //     lastscreendata.map((e) => {

    //         let k
    //         if (e.itemid !== 0) {
    //             k = e.itemname
    //         }
    //         muzamil.push(k)

    //     })
    // }
    // let obj = { ...muzamil }
    // console.log('====================================');
    // console.log(obj);
    // console.log('====================================');
    // var ingredients = JSON.stringify(obj)
    // console.log("FInly its become string", ingredients);


    useEffect(() => {
        getfavourite()
        apitest()
    }, [isFocused]);


    const getfavourite = async () => {
        setloader(true)
        const id = firebase.auth().currentUser.uid
        console.log(id)
            ;
        firestore()
            .collection('Favourite').where('loginpersonid', '==', id)
            .onSnapshot(querySnapshot => {
                //  console.log("------>",querySnapshot);
                const favouritedata = [];
                querySnapshot.forEach(documentSnapshot => {
                    console.log("------9090909090909090>", documentSnapshot);
                    favouritedata.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                (favouritedata);
                setfavouritedata(false)

            });

        // Unsubscribe from events when no longer in use
        // return () => subscriber();

    }

    const apitest = async () => {
        let ingredients = ''
        for (let i = 0; i < route.params.length; i++) {
            if (route.params[i].selected === true) {
                console.log('====================================');
                ingredients += route.params[i].itemname + ' '
                console.log('====================================');

            }

        }
        console.log("popopo", ingredients);
        setloader(true)
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
                'X-RapidAPI-Key': '2a55cd47d7mshefc4a9a1db6f882p146bd9jsn30b24c0e1ef9'
            }
        };







        // let firbaseList = []
        // await firebaseobect.get()
        //     .then(querySnapshot => {
        //         console.log('Total users: ', querySnapshot);

        //         querySnapshot.forEach(documentSnapshot => {
        //             firbaseList.push(documentSnapshot.data())
        //         });
        //     });


        let firbaseList = []

        // firestore()
        // .collection('Favourite')
        // .where('email', '==', user)
        // .get()
        // .then(documentSnapshot => {



        await firebaseobect.where('loginpersonid', '==', loginpersonid).get()
            .then(querySnapshot => {
                console.log('Total users: ', querySnapshot.size);
                querySnapshot.forEach(documentSnapshot => {
                    firbaseList.push(documentSnapshot.data())
                });
            });


        await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=${ingredients}&number=50&ignorePantry=false&ranking=1`, options)
            .then(response => response.json())
            .then(response => {
               console.log("yh response aa rha hay api sy ingredients ka",response);
                let islistf = []
                for (let index = 0; index < firbaseList.length; index++) {
                    for (let j = 0; j < response.length; j++) {
                        if (firbaseList[index].id === response[j].id)
                            islistf.push(response[j])

                    }

                }
                console.log('111', islistf);
                setFavoriteList(islistf)
                setpushrecord(response)
            })
            .catch(err => console.error(err));
        recoed.push(pushrecord)




        setloader(false)
    }


    // function to add an item to favorite list
    const onFavorite = restaurant => {
        setFavoriteList([...favoriteList, restaurant]);

        // var idds = 'id-' + restaurant.id;
        const emails = firebase.auth().currentUser.email
        const uniq = emails + restaurant.id;
        console.log(uniq);
        const userfavourites = firebaseobect.doc(uniq)
        userfavourites.set({
            firbaseid: uniq,
            image: restaurant.image,
            title: restaurant?.title,
            id: restaurant?.id,
            loginpersonid: loginpersonid,
        }).then(() => {
            // console.log("Favourite");
        })
            .catch((error) => {
                alert(error)
                console.log("Error---->", error);
            })
    };



    const onRemoveFavorite = restaurant => {
        const filteredList = favoriteList.filter(
            item => item.id !== restaurant.id
        );

        const emails = firebase.auth().currentUser.email
        const uniq = emails + restaurant.id;
        firestore().collection('Favourite').doc(uniq).delete()
        setFavoriteList(filteredList);
    };



    // function to check if an item exists in the favorite list or not
    const ifExists = restaurant => {
        if (favoriteList.filter(item => item.id === restaurant.id).length > 0) {
            return true;
        }
        return false;
    };








    const renderfunction = ({ item }) => {
        //   console.log("__________7_________", item);
        return (
            <View>
                <View style={Styles.renderfunctionmainview}>
                    <View >
                        <Image source={{ uri: item.image }} style={Styles.renderimage} />
                    </View>
                    <View style={{ height: rh(17), width: rw(54), left: rw(2) }}>
                        <View style={{ height: rh(17), justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                            <Text numberOfLines={1} style={{ fontSize: FontSize.font16, color: Colors.black, fontWeight: '700', width: rw(50) }}>{item.title}</Text>
                        </View>

                        {/* <View style={{ height: rh(10), top: 5, justifyContent: 'space-evenly' }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={Styles.innerboldhead}>Category:</Text>
                                <Text style={Styles.innerwithoutbold}>{item.categories}</Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={Styles.innerboldhead}>Cooking Time:</Text>
                                <Text style={Styles.innerwithoutbold}>{item.readyInMinutes}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: "row", width: rw('25') }}>
                                    <Text style={Styles.innerboldhead}>Calories:</Text>
                                    <Text style={Styles.innerwithoutbold}>{item.Calories}</Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={Styles.innerboldhead}>Fat:</Text>
                                    <Text style={Styles.innerwithoutbold}>{item.cookingTime}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: "row", width: rw('25') }}>
                                    <Text style={Styles.innerboldhead}>Carbs:</Text>
                                    <Text style={Styles.innerwithoutbold}>{item.Carbs}</Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={Styles.innerboldhead}>Protien:</Text>
                                    <Text style={Styles.innerwithoutbold}>{item.Protein}</Text>
                                </View>
                            </View>
                        </View> */}
                    </View>

                    <View style={{ right: rw(0), height: rh(11), justifyContent: "space-around" }}>
                        <TouchableOpacity style={{ marginTop: rh(1) }}
                            onPress={() => (ifExists(item) ? onRemoveFavorite(item) : onFavorite(item))}
                        >
                            {ifExists(item) ?

                                <Fontisto size={22} color={Colors.purple} name={'favorite'} />

                                :
                                <Fontisto size={22} color={Colors.dark} name={'favorite'} />
                            }


                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: rh(2) }} onPress={() => navigation.navigate('RecipiesDescription', item)}>
                            <ForwardSvg height={'25px'} width={'25px'} />
                        </TouchableOpacity>
                    </View>
                </View>


            </View>
        )
    }

    return (
        <SafeAreaView style={Styles.Container}>
            <View
                style={Styles.headerview}>
                <TouchableOpacity
                    style={{ left: rw(3) }}
                    onPress={() => navigation.replace('TabNavigations')}>
                    <Ionicons name="chevron-back" size={30} color={Colors.White} />
                </TouchableOpacity>
                <Text
                    style={Styles.headertext}>
                    RECIPES
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Filter', route?.params)}>
                    <Text
                        style={[Styles.headertext, { right: rw(7), borderBottomWidth: 0 }]}>
                        FILTER
                    </Text>
                </TouchableOpacity>

            </View>



            {loader ?
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <ActivityIndicator size={'large'} color={Colors.purple} />
                </View>
                :

                <FlatList
                    data={pushrecord}
                    keyExtractor={item => item.id}
                    renderItem={renderfunction}
                // ListFooterComponentStyle={{height:200}}
                />


            }

        </SafeAreaView>
    )
}




































// import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, ToastAndroid } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import { responsiveHeight as rh, responsiveWidth as rw } from 'react-native-responsive-dimensions'
// import Colors from '../../Global/Colors';
// import FontSize from '../../Global/FontSizes';
// import Styles from './FindRecipes.Styles';
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import MarkSvg from '../../Assets/Icons/MarkSvg.svg'
// import ForwardSvg from '../../Assets/Icons/ForwardSvg.svg'
// import { useIsFocused } from '@react-navigation/native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import Fontisto from 'react-native-vector-icons/Fontisto'
// import { firebase } from '@react-native-firebase/firestore';
// import firestore from '@react-native-firebase/firestore';


// import FavouriteColorfull from '../../Assets/Icons/FavouriteColorfull.svg'
// import { SafeAreaView } from 'react-native-safe-area-context';
// export default function FindRecipes({ navigation, route }) {
//     const isFocused = useIsFocused();
//     const loginpersonid = firebase.auth().currentUser.email
//     const firebaseobect = firestore().collection('Favourite')
//     // console.log("Last Screen Dat--------->", route?.params);

//     const [recoed, setrecoed] = useState([])
//     const [pushrecord, setpushrecord] = useState([])
//     const [lastscreendata, setlastscreendata] = useState(route?.params)
//     const [loader, setloader] = useState(false)
//     const [muzamil, setmuzamil] = useState([])
//     const [favoriteList, setFavoriteList] = useState([]);
//     const [favouritedata, setfavouritedata] = useState([])



//     console.log("------>", route?.params);




//     const PostDataInServer = async () => {
//         let ingredients = ''
//         for (let i = 0; i < route.params.length; i++) {
//             if (route.params[i].selected === true) {
//                 //    console.log('====================================');
//                 //      ingredients += route.params[i].itemname + ','

//                 //     console.log('====================================', ingredients);


//                 if (i != route.params.length - 1) {
//                     ingredients += route.params[i].itemname + ','
//                 }
//                 else {
//                     ingredients += route.params[i].itemname
//                 }

//             }
//             console.log('====================================', ingredients);
//         }
//         setloader(true)
//         fetch(`http://waqarulhaq.com/fromTheFridge/save-recipes.php?ingredients=${ingredients}&number=50`)
//             .then((response) => {
//                 if (response.status >= 200 && response.status <= 299) {
//                     return response.json();
//                 } else {
//                     throw Error(response.statusText);
//                 }
//             })
//             .then((jsonResponse) => {
//                 if (jsonResponse.msg == "Data saved successfully") {
//                     navigation.navigate('Home')
//                  console.log(jsonResponse.msg );
//                     ToastAndroid.show("Record Uploded !", ToastAndroid.SHORT);
//                     setloader(false)
//                     console.log("DOne");
//                 }
//                 else {
//                     alert("Record not saved")
//                     setloader(false)
//                 }
//                 setloader(false)
//             }).catch((error) => {
//                 setloader(false)
//                 // Handle the error
//                 console.log(error);
//             });


//     }






//     const dummykam = ({ item }) => {
//         // console.log("item",item);
//         return (
//             <View>
//                 <Text style={{ textAlign: 'center' }}>{item.itemname}</Text>
//             </View>

//         )
//     }



//     // fetch(`http://waqarulhaq.com/fromTheFridge/save-recipes.php?ingredients=${ingredients}&number=50`)
//     // .then((response) => {
//     //   if (response.status >= 200 && response.status <= 299) {
//     //     return response.json();
//     //   } else {
//     //     throw Error(response.statusText);
//     //   }
//     // })
//     // .then((jsonResponse) => {
//     //   console.log(jsonResponse);
//     // }).catch((error) => {
//     //   // Handle the error
//     //   console.log(error);
//     // });





















//     return (
//         <SafeAreaView style={Styles.Container}>
//             <View
//                 style={Styles.headerview}>
//                 <TouchableOpacity
//                     style={{ left: rw(3) }}
//                     onPress={() => navigation.replace('TabNavigations')}>
//                     <Ionicons name="chevron-back" size={30} color={Colors.White} />
//                 </TouchableOpacity>
//                 <Text
//                     style={Styles.headertext}>
//                     RECIPES
//                 </Text>
//                 <TouchableOpacity onPress={() => navigation.navigate('Filter', route?.params)}>
//                     <Text
//                         style={[Styles.headertext, { right: rw(7), borderBottomWidth: 0 }]}>
//                         FILTER
//                     </Text>
//                 </TouchableOpacity>




//             </View>



//             <FlatList
//                 data={route.params}
//                 keyExtractor={item => item.id}
//                 renderItem={
//                     dummykam
//                 }
//             />

//             {loader ?
//                 <ActivityIndicator color={'blck'} size={'large'} />
//                 :
//                 <TouchableOpacity onPress={() => PostDataInServer()} style={{ height: 50, width: 250, backgroundColor: Colors.purple, justifyContent: "center", alignSelf: 'center', alignContent: "center", bottom: 20 }}>
//                     <Text style={{ fontSize: 20, color: Colors.White, textAlign: 'center' }}>Hit ME</Text>
//                 </TouchableOpacity>
//             }

//         </SafeAreaView>
//     )
// }






































