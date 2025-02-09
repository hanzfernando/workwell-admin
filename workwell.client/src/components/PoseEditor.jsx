// PoseEditorSVG.jsx
import React, { useState, useRef } from 'react';

/**
 * INITIAL LANDMARKS (Realistic Sizing)
 * -------------------------------------
 * Coordinates are in pixels for a 500×600 canvas.
 */
const initialLandmarks = {
    // Head and Face
    nose: { x: 250, y: 100 },
    left_eye_inner: { x: 240, y: 95 },
    left_eye: { x: 235, y: 95 },
    left_eye_outer: { x: 230, y: 95 },
    right_eye_inner: { x: 260, y: 95 },
    right_eye: { x: 265, y: 95 },
    right_eye_outer: { x: 270, y: 95 },
    left_ear: { x: 225, y: 100 },
    right_ear: { x: 275, y: 100 },
    mouth_left: { x: 240, y: 110 },
    mouth_right: { x: 260, y: 110 },

    // Shoulders and Arms
    left_shoulder: { x: 220, y: 150 },
    right_shoulder: { x: 280, y: 150 },
    left_elbow: { x: 200, y: 200 },
    right_elbow: { x: 300, y: 200 },
    left_wrist: { x: 190, y: 250 },
    right_wrist: { x: 310, y: 250 },
    left_pinky: { x: 185, y: 255 },
    right_pinky: { x: 315, y: 255 },
    left_index: { x: 190, y: 255 },
    right_index: { x: 310, y: 255 },
    left_thumb: { x: 185, y: 250 },
    right_thumb: { x: 315, y: 250 },

    // Hips and Legs
    left_hip: { x: 230, y: 300 },
    right_hip: { x: 270, y: 300 },
    left_knee: { x: 230, y: 400 },
    right_knee: { x: 270, y: 400 },
    left_ankle: { x: 230, y: 500 },
    right_ankle: { x: 270, y: 500 },
    left_heel: { x: 225, y: 510 },
    right_heel: { x: 275, y: 510 },
    left_foot_index: { x: 235, y: 520 },
    right_foot_index: { x: 265, y: 520 },
};

/**
 * CONNECTIONS
 * -----------
 * Pairs of landmark names that should be connected by a line.
 */
const connections = [
    ["nose", "left_eye_inner"],
    ["left_eye_inner", "left_eye"],
    ["left_eye", "left_eye_outer"],
    ["left_eye_outer", "left_ear"],
    ["nose", "right_eye_inner"],
    ["right_eye_inner", "right_eye"],
    ["right_eye", "right_eye_outer"],
    ["right_eye_outer", "right_ear"],
    ["mouth_left", "mouth_right"],
    ["left_shoulder", "right_shoulder"],
    ["left_shoulder", "left_elbow"],
    ["left_elbow", "left_wrist"],
    ["left_wrist", "left_pinky"],
    ["left_wrist", "left_index"],
    ["left_wrist", "left_thumb"],
    ["right_shoulder", "right_elbow"],
    ["right_elbow", "right_wrist"],
    ["right_wrist", "right_pinky"],
    ["right_wrist", "right_index"],
    ["right_wrist", "right_thumb"],
    ["left_shoulder", "left_hip"],
    ["right_shoulder", "right_hip"],
    ["left_hip", "right_hip"],
    ["left_hip", "left_knee"],
    ["left_knee", "left_ankle"],
    ["left_ankle", "left_heel"],
    ["left_heel", "left_foot_index"],
    ["right_hip", "right_knee"],
    ["right_knee", "right_ankle"],
    ["right_ankle", "right_heel"],
    ["right_heel", "right_foot_index"],
];

/**
 * SKELETON HIERARCHY
 * ------------------
 * Defines parent–child relationships. When a parent joint is moved,
 * its child joints move by the same delta.
 */
const skeletonHierarchy = {
    // Face: Moving the nose might move face landmarks (if desired)
    nose: [
        "left_eye_inner",
        "left_eye",
        "left_eye_outer",
        "right_eye_inner",
        "right_eye",
        "right_eye_outer",
        "left_ear",
        "right_ear",
        "mouth_left",
        "mouth_right",
    ],
    // Left arm
    left_shoulder: ["left_elbow"],
    left_elbow: ["left_wrist"],
    left_wrist: ["left_pinky", "left_index", "left_thumb"],
    // Right arm
    right_shoulder: ["right_elbow"],
    right_elbow: ["right_wrist"],
    right_wrist: ["right_pinky", "right_index", "right_thumb"],
    // Left leg
    left_hip: ["left_knee"],
    left_knee: ["left_ankle"],
    left_ankle: ["left_heel"],
    left_heel: ["left_foot_index"],
    // Right leg
    right_hip: ["right_knee"],
    right_knee: ["right_ankle"],
    right_ankle: ["right_heel"],
    right_heel: ["right_foot_index"],
};

/**
 * Build a Parent Mapping from the Hierarchy
 * ------------------------------------------
 * For each child, record its parent.
 */
const parentMap = {};
Object.entries(skeletonHierarchy).forEach(([parent, children]) => {
    children.forEach((child) => {
        parentMap[child] = parent;
    });
});

/**
 * Maximum Allowed Distance from Parent (in pixels)
 * --------------------------------------------------
 * Only joints that have a parent (per parentMap) are constrained.
 * These values can be adjusted to better reflect human anatomy.
 */
const maxDistances = {
    // Face (relative to nose)
    left_eye_inner: 20,
    left_eye: 20,
    left_eye_outer: 20,
    right_eye_inner: 20,
    right_eye: 20,
    right_eye_outer: 20,
    left_ear: 30,
    right_ear: 30,
    mouth_left: 30,
    mouth_right: 30,
    // Left arm
    left_elbow: 80,
    left_wrist: 80,
    left_pinky: 40,
    left_index: 40,
    left_thumb: 40,
    // Right arm
    right_elbow: 80,
    right_wrist: 80,
    right_pinky: 40,
    right_index: 40,
    right_thumb: 40,
    // Left leg
    left_knee: 100,
    left_ankle: 100,
    left_heel: 40,
    left_foot_index: 40,
    // Right leg
    right_knee: 100,
    right_ankle: 100,
    right_heel: 40,
    right_foot_index: 40,
};

/**
 * updateRecursive
 * ---------------
 * Given a positions object, a joint name, and a delta,
 * update the joint’s position and recursively update its children.
 */
function updateRecursive(positions, joint, delta) {
    if (!positions[joint]) return;
    positions[joint] = {
        x: positions[joint].x + delta.x,
        y: positions[joint].y + delta.y,
    };
    const children = skeletonHierarchy[joint];
    if (children) {
        children.forEach((child) => {
            updateRecursive(positions, child, delta);
        });
    }
}

/**
 * computeAngle
 * ------------
 * Given three points A, B, and C (with B as the vertex), compute the angle at B.
 */
function computeAngle(A, B, C) {
    const BAx = A.x - B.x;
    const BAy = A.y - B.y;
    const BCx = C.x - B.x;
    const BCy = C.y - B.y;
    const dot = BAx * BCx + BAy * BCy;
    const magBA = Math.sqrt(BAx * BAx + BAy * BAy);
    const magBC = Math.sqrt(BCx * BCx + BCy * BCy);
    if (magBA === 0 || magBC === 0) return 0;
    const angleRad = Math.acos(dot / (magBA * magBC));
    return angleRad * (180 / Math.PI);
}

function PoseEditorSVG() {
    const [landmarks, setLandmarks] = useState(initialLandmarks);
    const [draggingJoint, setDraggingJoint] = useState(null);
    const [angleResults, setAngleResults] = useState(null);
    const svgRef = useRef(null);

    // When the user presses down on a joint, mark it as the active (dragged) joint.
    const handleMouseDown = (joint) => (e) => {
        setDraggingJoint(joint);
    };

    // Update the joint position as the mouse moves.
    const handleMouseMove = (e) => {
        if (!draggingJoint) return;
        const svg = svgRef.current;
        if (!svg) return;
        // Convert screen coordinates into SVG coordinates.
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const cursorPt = pt.matrixTransform(svg.getScreenCTM().inverse());
        updateJoint(draggingJoint, { x: cursorPt.x, y: cursorPt.y });
    };

    // Stop dragging when the mouse is released or leaves the SVG.
    const handleMouseUp = () => {
        setDraggingJoint(null);
    };

    /**
     * updateJoint
     * -----------
     * Update a joint’s position and, if it has a parent, enforce a maximum allowed distance.
     * Then, update any child joints recursively.
     */
    const updateJoint = (joint, newPos) => {
        setLandmarks((prev) => {
            // Copy previous positions.
            const newPositions = { ...prev };
            const oldPos = prev[joint];

            // If this joint has a parent, enforce the maximum allowed distance.
            if (parentMap[joint]) {
                const parent = parentMap[joint];
                const parentPos = prev[parent];
                const dx = newPos.x - parentPos.x;
                const dy = newPos.y - parentPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = maxDistances[joint] || Infinity;
                if (dist > maxDistance) {
                    const factor = maxDistance / dist;
                    newPos = {
                        x: parentPos.x + dx * factor,
                        y: parentPos.y + dy * factor,
                    };
                }
            }
            // Compute the delta from the old position.
            const delta = {
                x: newPos.x - oldPos.x,
                y: newPos.y - oldPos.y,
            };
            // Update this joint and any children recursively.
            updateRecursive(newPositions, joint, delta);
            return newPositions;
        });
    };

    /**
     * handleSubmit
     * ------------
     * Compute and log selected joint angles.
     * In this example, we calculate angles at the elbows, knees, shoulders, and hips.
     */
    const handleSubmit = () => {
        const leftElbowAngle = computeAngle(
            landmarks.left_shoulder,
            landmarks.left_elbow,
            landmarks.left_wrist
        );
        const rightElbowAngle = computeAngle(
            landmarks.right_shoulder,
            landmarks.right_elbow,
            landmarks.right_wrist
        );
        const leftKneeAngle = computeAngle(
            landmarks.left_hip,
            landmarks.left_knee,
            landmarks.left_ankle
        );
        const rightKneeAngle = computeAngle(
            landmarks.right_hip,
            landmarks.right_knee,
            landmarks.right_ankle
        );
        // Optionally, compute shoulder and hip angles.
        const leftShoulderAngle = computeAngle(
            landmarks.nose,
            landmarks.left_shoulder,
            landmarks.left_elbow
        );
        const rightShoulderAngle = computeAngle(
            landmarks.nose,
            landmarks.right_shoulder,
            landmarks.right_elbow
        );
        const leftHipAngle = computeAngle(
            landmarks.left_shoulder,
            landmarks.left_hip,
            landmarks.left_knee
        );
        const rightHipAngle = computeAngle(
            landmarks.right_shoulder,
            landmarks.right_hip,
            landmarks.right_knee
        );

        // Log to the console.
        console.log("Left Elbow Angle:", leftElbowAngle.toFixed(2), "degrees");
        console.log("Right Elbow Angle:", rightElbowAngle.toFixed(2), "degrees");
        console.log("Left Knee Angle:", leftKneeAngle.toFixed(2), "degrees");
        console.log("Right Knee Angle:", rightKneeAngle.toFixed(2), "degrees");
        console.log("Left Shoulder Angle:", leftShoulderAngle.toFixed(2), "degrees");
        console.log("Right Shoulder Angle:", rightShoulderAngle.toFixed(2), "degrees");
        console.log("Left Hip Angle:", leftHipAngle.toFixed(2), "degrees");
        console.log("Right Hip Angle:", rightHipAngle.toFixed(2), "degrees");

        // Save the computed angles in state to display on the UI.
        setAngleResults({
            leftElbowAngle: leftElbowAngle.toFixed(2),
            rightElbowAngle: rightElbowAngle.toFixed(2),
            leftKneeAngle: leftKneeAngle.toFixed(2),
            rightKneeAngle: rightKneeAngle.toFixed(2),
            leftShoulderAngle: leftShoulderAngle.toFixed(2),
            rightShoulderAngle: rightShoulderAngle.toFixed(2),
            leftHipAngle: leftHipAngle.toFixed(2),
            rightHipAngle: rightHipAngle.toFixed(2),
        });
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>33‑Landmark Pose Editor (SVG)</h2>
            <svg
                ref={svgRef}
                width={500}
                height={600}
                style={{ border: '1px solid gray', background: '#f9f9f9' }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Render lines connecting joints */}
                {connections.map(([jointA, jointB], index) => {
                    const posA = landmarks[jointA];
                    const posB = landmarks[jointB];
                    if (!posA || !posB) return null;
                    return (
                        <line
                            key={index}
                            x1={posA.x}
                            y1={posA.y}
                            x2={posB.x}
                            y2={posB.y}
                            stroke="black"
                            strokeWidth="2"
                        />
                    );
                })}

                {/* Render joints as draggable circles */}
                {Object.entries(landmarks).map(([joint, pos]) => (
                    <circle
                        key={joint}
                        cx={pos.x}
                        cy={pos.y}
                        r="5"
                        fill="hotpink"
                        onMouseDown={handleMouseDown(joint)}
                        style={{ cursor: 'pointer' }}
                    />
                ))}

                {/* Optionally, render joint labels */}
                {Object.entries(landmarks).map(([joint, pos]) => (
                    <text
                        key={`${joint}-label`}
                        x={pos.x + 6}
                        y={pos.y - 6}
                        fontSize="10"
                        fill="black"
                    >
                        {joint}
                    </text>
                ))}
            </svg>
            <br />
            <button onClick={handleSubmit}>Submit Pose</button>
            {angleResults && (
                <div className="mt-4">
                    <h3>Computed Angles:</h3>
                    <ul className="list-disc text-left mx-auto max-w-xs">
                        <li>Left Elbow: {angleResults.leftElbowAngle}°</li>
                        <li>Right Elbow: {angleResults.rightElbowAngle}°</li>
                        <li>Left Knee: {angleResults.leftKneeAngle}°</li>
                        <li>Right Knee: {angleResults.rightKneeAngle}°</li>
                        <li>Left Shoulder: {angleResults.leftShoulderAngle}°</li>
                        <li>Right Shoulder: {angleResults.rightShoulderAngle}°</li>
                        <li>Left Hip: {angleResults.leftHipAngle}°</li>
                        <li>Right Hip: {angleResults.rightHipAngle}°</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default PoseEditorSVG;
