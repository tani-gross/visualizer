import React, { createContext, useContext, useState, useRef } from 'react';

const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [text, setText] = useState("Add Node or Generate Graph to Begin");
    const [nodes, setNodes] = useState([]);
    const [nodeCount, setNodeCount] = useState(0);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [isAddingEdge, setIsAddingEdge] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [isRemovingEdge, setIsRemovingEdge] = useState(false);
    const [visitedNodes, setVisitedNodes] = useState([]);
    const [visitedEdges, setVisitedEdges] = useState([]);
    const [adjList, setAdjList] = useState([]);
    const [clickedTraversal, setClickedTraversal] = useState(false);
    const [clickedMST, setClickedMST] = useState(false);
    const [clickedPaths, setClickedPaths] = useState(false);
    const [isDFS, setIsDFS] = useState(false);
    const [isBFS, setIsBFS] = useState(false);
    const [isPrim, setIsPrim] = useState(false);
    const [isTSP, setIsTSP] = useState(false);
    const [algorithmRunning, setAlgorithmRunning] = useState(false);
    const [isShortestPath, setIsShortestPath] = useState(false);
    const [startNode, setStartNode] = useState(null);
    const [endNode, setEndNode] = useState(null);
    const componentColors = ["blue", "green", "orange", "purple", "pink", "yellow", "gold", "coral", "crimson", "cyan", "darkgreen", "drakblue", "darkorange", "darkorchid", "darkred", "deeppink", "darkviolet", "deepskyblue", "forestgreen", "fuchsia"];
    const [components, setComponents] = useState([]);
    const [showWeights, setShowWeights] = useState(false);
    const [sliderValue, setSliderValue] = useState(250);
    const [currentNode, setCurrentNode] = useState(null);
    const sliderValueRef = useRef(sliderValue);
    const totalSliderCount = 2100;
    const [isPaused, setIsPaused] = useState(false);
    const isPausedRef = useRef(isPaused);
    const [currentStep, setCurrentStep] = useState(0);
    const currentStepRef = useRef(currentStep);
    const [isStepMode, setIsStepMode] = useState(false);
    const isStepModeRef = useRef(isStepMode);
    const [disablePause, setDisablePause] = useState(false);
    const [algorithmStarted, setAlgorithmStarted] = useState(false);
    const [runningAlgorithm, setRunningAlgorithm] = useState(null);
    const [isDirected, setIsDirected] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlerting, setIsAlerting] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const highlightedButtonColor = "lightblue";
    const startingText = "Move Node, Select Node, or Press Button to Continue";
    const treeEdgeColor = "blue";
    const currentEdgeColor = "red";
    const defaultEdgeColor = "grey";

    return (
        <GraphContext.Provider
            value={{
                text,
                setText,
                nodes,
                setNodes,
                nodeCount,
                setNodeCount,
                edges,
                setEdges,
                selectedNode,
                setSelectedNode,
                isAddingEdge,
                setIsAddingEdge,
                dragging,
                setDragging,
                isRemovingEdge,
                setIsRemovingEdge,
                visitedNodes,
                setVisitedNodes,
                visitedEdges,
                setVisitedEdges,
                adjList,
                setAdjList,
                clickedTraversal,
                setClickedTraversal,
                clickedMST,
                setClickedMST,
                clickedPaths,
                setClickedPaths,
                isDFS,
                setIsDFS,
                isBFS,
                setIsBFS,
                isPrim,
                setIsPrim,
                isTSP,
                setIsTSP,
                algorithmRunning,
                setAlgorithmRunning,
                isShortestPath,
                setIsShortestPath,
                startNode,
                setStartNode,
                endNode,
                setEndNode,
                componentColors,
                components,
                setComponents,
                showWeights,
                setShowWeights,
                sliderValue,
                setSliderValue,
                currentNode,
                setCurrentNode,
                sliderValueRef,
                totalSliderCount,
                isPaused,
                setIsPaused,
                isPausedRef,
                currentStep,
                setCurrentStep,
                currentStepRef,
                isStepMode,
                setIsStepMode,
                isStepModeRef,
                disablePause,
                setDisablePause,
                algorithmStarted,
                setAlgorithmStarted,
                runningAlgorithm,
                setRunningAlgorithm,
                isDirected,
                setIsDirected,
                isModalOpen,
                setIsModalOpen,
                highlightedButtonColor,
                currentEdgeColor,
                defaultEdgeColor,
                startingText,
                treeEdgeColor,
                isAlerting,
                setIsAlerting,
                modalMessage,
                setModalMessage
            }}
        >
            {children}
        </GraphContext.Provider>
    );
};

export const useGraph = () => useContext(GraphContext);
