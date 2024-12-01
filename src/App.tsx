import { useState } from "react";
// @ts-ignore
import "./App.css";

// Define the shape of the calculator state
interface CalculatorState {
    firstOperand: string | null;
    secondOperand: string | null;
    operator: string;
}

export default function App() {
    const [calc, setCalc] = useState<CalculatorState>({
        firstOperand: null,
        secondOperand: null,
        operator: "=",
    });

    const handleNumber = (number: string) => {
        if (calc.secondOperand !== null && calc.secondOperand.length === 15) return; // limit at 15 digits
        if (calc.secondOperand === "0" && number === "0") return;
        if (calc.secondOperand?.includes(".") && number === ".") return;

        let updatedCalc: CalculatorState;

        if (calc.secondOperand === null && number === ".") {
            updatedCalc = {
                ...calc,
                secondOperand: "0.",
            };
        } else {
            updatedCalc = {
                ...calc,
                secondOperand: calc.secondOperand !== null ? calc.secondOperand + number : number,
            };
        }
        setCalc(updatedCalc);
    };

    const handleOperator = (operator: string) => {
        if (calc.firstOperand === null && calc.secondOperand === null) return;

        if (calc.firstOperand === null) {
            setCalc({
                ...calc,
                operator,
                firstOperand: calc.secondOperand,
                secondOperand: null,
            });
        } else {
            setCalc({
                ...calc,
                operator,
            });
        }

        if (calc.secondOperand === null) {
            setCalc({
                ...calc,
                operator,
            });
        }

        if (calc.firstOperand !== null && calc.secondOperand !== null) {
            setCalc({
                ...calc,
                firstOperand: compute(),
                operator,
                secondOperand: null,
            });
        }
    };

    const handleClear = () => {
        setCalc({
            ...calc,
            firstOperand: null,
            secondOperand: null,
            operator: "=",
        });
    };

    const handlePlusMinus = () => {
        if (calc.secondOperand !== null) {
            const secondOperand = (-1 * parseFloat(calc.secondOperand)).toString();
            setCalc({
                ...calc,
                secondOperand,
            });
        }
    };

    const handlePercent = () => {
        if (calc.secondOperand !== null) {
            let secondOperand = parseFloat(calc.secondOperand) * 0.01;
            if (secondOperand.toString().length > 7) {
                secondOperand = parseFloat(secondOperand.toFixed(7));
            }
            setCalc({
                ...calc,
                secondOperand: secondOperand.toString(),
            });
        }
    };

    const handleDelete = () => {
        if (calc.secondOperand === null) return;
        let secondOperand: string | null = calc.secondOperand;
        if (secondOperand.length === 1) {
            secondOperand = null;
        } else {
            secondOperand = secondOperand.slice(0, -1);
        }
        setCalc({
            ...calc,
            secondOperand,
        });
    };

    const handleCompute = () => {
        setCalc({
            ...calc,
            secondOperand: compute(),
            firstOperand: null,
        });
    };

    const format = (value: string | null): string | undefined => {
        if (value === null) return;
        const sub = value.split(",");
        let formatted = "";
        if (sub.length > 1) {
            formatted = sub[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "," + sub[1];
        } else {
            formatted = sub[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return formatted;
    };

    const compute = (): string => {
        if (calc.firstOperand !== null && calc.secondOperand !== null && calc.operator !== null) {
            let result = 0;

            const firstOperand = parseFloat(calc.firstOperand);
            const secondOperand = parseFloat(calc.secondOperand);

            if (isNaN(firstOperand) || isNaN(secondOperand)) {
                return "";
            }

            switch (calc.operator) {
                case "+":
                    result = firstOperand + secondOperand;
                    break;
                case "-":
                    result = firstOperand - secondOperand;
                    break;
                case "x":
                    result = firstOperand * secondOperand;
                    break;
                case "÷":
                    result = secondOperand > 0 ? firstOperand / secondOperand : NaN;
                    break;
                default:
                    return "";
            }

            if (!isNaN(result) && result.toString().length > 7) {
                result = parseFloat(result.toFixed(7)); // limit decimals to 7
            }

            return !isNaN(result) ? result.toString().replace(".", ".") : "NOT ALLOW"; // Help for formatting
        }
        return "";
    };

    return (
        <div className="container">
            <div className="calculator">
                <div className="screens">
                    <span className="first-screen">
                        {calc.firstOperand !== null &&
                            `${format(calc.firstOperand)} ${calc.operator}`}
                    </span>
                    <span
                        className={`second-screen ${
                            calc.secondOperand !== null && calc.secondOperand.length > 9
                                ? "small"
                                : "normal"
                        }`}
                    >
                        {format(calc.secondOperand)}
                    </span>
                </div>

                <div className="inputsWrapper">
                    <button className="featured" onClick={() => handleClear()}>
                        C
                    </button>
                    <button className="featured" onClick={() => handlePlusMinus()}>
                        +/-
                    </button>
                    <button className="featured" onClick={() => handlePercent()}>
                        %
                    </button>
                    <button className="featured" onClick={() => handleOperator("÷")}>
                        ÷
                    </button>
                    <button onClick={() => handleNumber("7")}>7</button>
                    <button onClick={() => handleNumber("8")}>8</button>
                    <button onClick={() => handleNumber("9")}>9</button>
                    <button className="featured" onClick={() => handleOperator("x")}>
                        x
                    </button>
                    <button onClick={() => handleNumber("4")}>4</button>
                    <button onClick={() => handleNumber("5")}>5</button>
                    <button onClick={() => handleNumber("6")}>6</button>
                    <button className="featured" onClick={() => handleOperator("-")}>
                        -
                    </button>
                    <button onClick={() => handleNumber("1")}>1</button>
                    <button onClick={() => handleNumber("2")}>2</button>
                    <button onClick={() => handleNumber("3")}>3</button>
                    <button className="featured" onClick={() => handleOperator("+")}>
                        +
                    </button>
                    <button onClick={() => handleNumber(".")}>.</button>
                    <button onClick={() => handleNumber("0")}>0</button>
                    <button onClick={() => handleDelete()}>⌫</button>
                    <button className="featured" onClick={() => handleCompute()}>
                        =
                    </button>
                </div>
            </div>
        </div>
    );
}

