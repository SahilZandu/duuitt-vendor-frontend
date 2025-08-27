import Input from "../../../components/Ui/Input";
import Button from "../../../components/Ui/Button";
import MenuIcon from "../../../lib/MenuIcon";
import type { AddonGroups } from "../../../types/types";
interface AddonError {
    group?: string;
    max_selection?: string;
    addon?: Record<
        number,
        {
            name?: string;
            price?: string;
        }
    >;
}
interface AddonsSectionProps {
    addons: AddonGroups[];
    setAddons: React.Dispatch<React.SetStateAction<AddonGroups[]>>;
    required?: boolean;
    errors?: Record<number, AddonError>;
    setErrors?: React.Dispatch<React.SetStateAction<Record<number, string[]>>>;

}

export default function AddonsSection({ addons, setAddons, required = false, errors }: AddonsSectionProps) {
    console.log("errors in addons-------------------", errors);
    console.log("addons-----------", addons);

    const generateId = () => Math.floor(Math.random() * 100000);

    const createGroup = (): AddonGroups => ({
        id: generateId(),
        groupName: "",                     // required
        group: "",                         // required
        priceable: false,                  // required
        maxSelectionLimit: "",             // required (string in your interface)
        values: [],                        // required
        // legacy/optional fields:
        is_price_related: false,
        max_selection: "",
        addon: [{ id: generateId(), name: "", price: "" }]
    });


    const addGroup = () => {
        if (addons.length >= 3) return;
        setAddons(prev => [...prev, createGroup()]);
    };

    const removeGroup = (id: number) => setAddons(prev => prev.filter(g => g.id !== id));
    const updateGroupName = (id: number, name: string) => setAddons(prev => prev.map(g => g.id === id ? { ...g, group: name } : g));
    const togglePriceable = (id: number) => setAddons(prev => prev.map(g => g.id === id ? { ...g, is_price_related: !g.is_price_related } : g));
    const updateAddonName = (groupId: number, valueId: number, name: string) =>
        setAddons(prev => prev.map(g => g.id === groupId ? { ...g, addon: g.addon.map(v => v.id === valueId ? { ...v, name } : v) } : g));
    const updateAddonPrice = (groupId: number, valueId: number, price: string) =>
        setAddons(prev => prev.map(g => g.id === groupId ? { ...g, addon: g.addon.map(v => v.id === valueId ? { ...v, price } : v) } : g));
    const addAddonValue = (groupId: number) =>
        setAddons(prev => prev.map(g => g.id === groupId ? { ...g, addon: [...g.addon, { id: generateId(), name: "", price: "" }] } : g));
    const removeAddonValue = (groupId: number, valueId: number) =>
        setAddons(prev => prev.map(g => g.id === groupId ? { ...g, addon: g.addon.filter(v => v.id !== valueId) } : g));
    const updateMaxSelection = (groupId: number, value: string) => {
        setAddons(prev =>
            prev.map(g =>
                g.id === groupId ? { ...g, max_selection: value } : g
            )
        );
    };

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold mb-4">Addons</h2>
                {addons.length < 3 && (
                    <Button variant="soft-success" iconLeft={<MenuIcon name="add" />} label="Add Addon Group" onClick={addGroup} />
                )}
            </div>

            {addons && addons?.length > 0 && addons?.map((group, idx) => (
                <div key={group.id} className="border p-4 rounded mb-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3 gap-2">
                        <Input label={`Group Title ${idx + 1}`} error={errors?.[group.id]?.group} required={required} value={group.group}
                            onChange={e => {
                                updateGroupName(group.id, e.target.value);
                            }} />
                        <Button label="" variant="danger" iconLeft={<MenuIcon name="delete" />} onClick={() => removeGroup(group.id)} />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        Priceable
                        <label className="inline-flex items-center cursor-pointer ">

                            <input
                                type="checkbox"
                                checked={group.is_price_related}
                                onChange={() => togglePriceable(group?.id)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 relative"></div>
                        </label>

                    </div>

                    {group?.addon?.map((value, index) => (
                        <div key={value.id} className="flex items-center gap-2">
                            <Input placeholder="Addon Name" error={errors?.[group.id]?.addon?.[value.id]?.name} value={value.name} required={required}
                                onChange={e => {
                                    updateAddonName(group.id, value.id, e.target.value);
                                }} />
                            {group.is_price_related && (
                                <Input placeholder="Selling Price" error={errors?.[group.id]?.addon?.[value.id]?.price} type="number" required={required} value={value?.price || ""}
                                    onChange={e => {
                                        updateAddonPrice(group.id, value.id, e.target.value);
                                    }} />
                            )}
                            {index !== 0 && (
                                <Button label="" variant="danger" iconLeft={<MenuIcon name="delete" />} onClick={() => removeAddonValue(group.id, value.id)} />
                            )}
                        </div>
                    ))}
                    <Input
                        label="Maximum Selection Limit"
                        type="number"
                        required={required}
                        value={group?.max_selection || ""}
                        disabled={group.addon.length === 0}
                        onChange={(e) => {
                            updateMaxSelection(group.id, e.target.value);
                        }}
                    />

                    <Button variant="soft-success" iconLeft={<MenuIcon name="add" />} label="Add More" onClick={() => addAddonValue(group.id)} className="mt-3" />
                </div>
            ))}
        </div>
    );
}
