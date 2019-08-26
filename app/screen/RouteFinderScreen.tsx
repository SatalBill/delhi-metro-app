import LottieView from 'lottie-react-native';
import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import StationListModal from '../components/StationListModal';
import RouteResultModal from '../components/RouteResultModal';
import Typography from '../constants/Typography';
import Colors from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

console.disableYellowBox = true;

const LottieAnimationSource: NodeRequire = require('../../assets/animations/map.json');
const InitialRequestUrl: string = 'https://us-central1-delhimetroapi.cloudfunctions.net/route?';

const { width } = Dimensions.get('window');

const RouteFinderScreen = () => {

    const startingPointModalRef = useRef(null);
    const destinationModalRef = useRef(null);
    const routeResultModalRef = useRef(null);

    const [didMount, setDidMount] = useState(false);
    const [startingPoint, setStartingPoint] = useState('');
    const [destinationPoint, setDestinationPoint] = useState('');
    const [requestUrl, setRequestUrl] = useState(InitialRequestUrl);
    const [routeResultData, setRouteResultData] = useState({ path: [], time: 0 });

    const dispatchRequest = () => setRequestUrl(`${InitialRequestUrl}from=${startingPoint}&to=${destinationPoint}`);

    useEffect(() => setDidMount(true), []);
    useEffect(() => {
        const getShortestPath = async (): Promise<void> => {
            try {
                const response = await fetch(requestUrl as RequestInfo);
                const { path, time } = await response.json();
                setRouteResultData({ path, time });

                routeResultModalRef.current.openModal();
            } catch {
                alert('Please select the destinations properly');
            }
        };

        if (didMount)
            getShortestPath();
    }, [requestUrl])

    return (
        <View style={styles.container}>
            <LottieView
                autoPlay
                ref={animation => { this.animation = animation; }}
                style={{ height: 200, width: 200 }}
                source={LottieAnimationSource as any}
            />
            <TouchableOpacity
                onPress={() => startingPointModalRef.current.openModal()}
                style={styles.locationContainer}>
                <Text style={styles.locationText}>{startingPoint ? startingPoint : 'Select Current'}</Text>
                {/* <FontAwesome name='dot-circle-o' color='red' size={20} /> */}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => destinationModalRef.current.openModal()}
                style={styles.locationContainer}>
                <Text style={styles.locationText}>{destinationPoint ? destinationPoint : 'Select Destination'}</Text>
                {/* <FontAwesome name='dot-circle-o' color='green' size={20} /> */}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => dispatchRequest()}
                style={styles.startButtonContainer}>
                <Text style={styles.startButtonText}>Let's Go</Text>
            </TouchableOpacity>

            <StationListModal
                ref={startingPointModalRef}
                onStationSelected={station => setStartingPoint(station)}
            />
            
            <StationListModal
                ref={destinationModalRef}
                onStationSelected={station => setDestinationPoint(station)}
            />

            <RouteResultModal
                ref={routeResultModalRef}
                from={startingPoint}
                to={destinationPoint}
                routeResultData={routeResultData}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width * 0.6,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.primary.regular,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginTop: 16,
        borderRadius: 20
    },
    locationText: {
        ...Typography.body,
        fontSize: 16
    },
    startButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.4,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginTop: 24,
        backgroundColor: Colors.primary.regular,
        borderRadius: 20
    },
    startButtonText: {
        ...Typography.body,
        fontSize: 16,
        color: Colors.secondary.light
    },
});

export default RouteFinderScreen;