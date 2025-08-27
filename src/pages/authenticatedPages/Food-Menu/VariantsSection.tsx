import { useState } from "react";
import Input from "../../../components/Ui/Input";
import Button from "../../../components/Ui/Button";
import MenuIcon from "../../../lib/MenuIcon";

interface VariantsSectionProps {
    variants: Variant[];
    setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
    generatedCombinations: any[];
    setGeneratedCombinations: React.Dispatch<React.SetStateAction<any[]>>;
    onCombinationsChange: (combinations: any[]) => void;
    errors: { [key: string]: string };
    // setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}
export default function VariantsSection({ variants, setVariants, generatedCombinations, setGeneratedCombinations, onCombinationsChange, errors, setErrors }: VariantsSectionProps) {
    console.log("generatedCombinations--------------", generatedCombinations);

    const generateId = () => Math.floor(Math.random() * 100000);

    const addVariant = () => {
        if (variants.length >= 2) return;
        setVariants(prev => [...prev, { id: generateId(), group: "", variant: [{ id: generateId(), name: "" }] }]);
    };

    const removeVariant = (id: number) => {
        setVariants(prev => prev.filter(v => v.id !== id));
        setGeneratedCombinations([]);
    };

    const updateGroup = (id: number, name: string) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, group: name } : v));
    };

    const addValue = (variantId: number) => {
        setVariants(prev => prev.map(v =>
            v.id === variantId ? { ...v, variant: [...v.variant, { id: generateId(), name: "" }] } : v
        ));
        setGeneratedCombinations([]);
    };

    const updateValue = (variantId: number, valueId: number, name: string) => {
        setVariants(prev => prev.map(v =>
            v.id === variantId
                ? { ...v, variant: v.variant.map(val => val.id === valueId ? { ...val, name } : val) }
                : v
        ));
    };

    const removeValue = (variantId: number, valueId: number) => {
        setVariants(prev => prev.map(v =>
            v.id === variantId ? { ...v, variant: v.variant.filter(val => val.id !== valueId) } : v
        ));
        setGeneratedCombinations([]);
    };
    const validateVariants = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        let hasError = false;

        variants.forEach(v => {
            if (!v.group.trim()) {
                newErrors[`group-${v.id}`] = "Variant group is required";
                hasError = true;
            }
            v.variant.forEach(val => {
                if (!val.name.trim()) {
                    newErrors[`value-${val.id}`] = "Variant value is required";
                    hasError = true;
                }
            });
        });

        // setErrors(newErrors);
        return !hasError;
    };
    const generateCombinations = () => {
        if (!variants.length) return;
        if (!validateVariants()) return;
        const variantValues = variants.map(v => v.variant.map(val => val.name).filter(Boolean));
        if (variantValues.some(arr => arr.length === 0)) return;

        let combos: any[] = [];

        if (variantValues.length === 1) {
            combos = variantValues[0].map(value => ({
                first_gp: value,
                second_gp: "",  // empty string here
                price: "",
            }));
        } else if (variantValues.length === 2) {
            combos = variantValues[0].flatMap(first =>
                variantValues[1].map(second => ({
                    first_gp: first,
                    second_gp: second,
                    price: "",
                }))
            );
        } else {
            combos = [];
        }

        setGeneratedCombinations(combos);
        onCombinationsChange(combos);
    };


    return (
        <div className="border p-2">
            <div className="flex justify-between">
                <h2 className="text-lg font-semibold mb-4">Item Variants</h2>
                {variants.length < 2 && (
                    <Button type="button" iconLeft={<MenuIcon name="add" />} variant="soft-success" label="Add Variant" onClick={addVariant} />
                )}
            </div>

            {variants && variants?.length > 0 && variants?.map((variant, i) => (
                <div key={variant.id} className="border p-4 my-6 rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-purple-600 font-semibold text-lg">Variant {i + 1}</h3>
                        <Button variant="danger" label="Delete" iconLeft={<MenuIcon name="delete" />} onClick={() => removeVariant(variant.id)} />
                    </div>

                    <Input placeholder="Enter variant group" value={variant?.group} onChange={e => updateGroup(variant.id, e.target.value)}  />

                    <div className="flex justify-between mt-3">
                        <label>Values</label>
                        <Button type="button" variant="soft-success" iconLeft={<MenuIcon name="add" />} label="Add More" onClick={() => addValue(variant.id)} />
                    </div>

                    {variant.variant.map((val, idx) => (
                        <div key={val.id} className="flex items-center gap-2 my-2">
                            <Input value={val.name} onChange={e => updateValue(variant.id, val.id, e.target.value)} placeholder="Variant value" />
                            {idx !== 0 && (
                                <Button variant="danger" label="Delete" iconLeft={<MenuIcon name="delete" />} onClick={() => removeValue(variant.id, val.id)} />
                            )}
                        </div>
                    ))}
                </div>
            ))}

            {variants.length > 0 && (
                <div className="flex justify-end">
                    <Button label="Generate Combination" onClick={generateCombinations} />
                </div>
            )}

            {generatedCombinations.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Generated Combinations</h3>
                    {generatedCombinations?.map((combo, idx) => (
                        <Input
                            key={idx}
                            type="number"
                            label={combo.second_gp ? `${combo.first_gp} - ${combo.second_gp}` : combo.first_gp}
                            placeholder="Enter amount"
                            value={combo?.price}
                            onChange={(e) => {
                                const updated = [...generatedCombinations];
                                updated[idx].price = Number(e.target.value);
                                setGeneratedCombinations(updated);
                                onCombinationsChange(updated);
                            }}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}
