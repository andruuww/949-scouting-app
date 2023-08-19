import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from '@/lib/types';
import { useState } from 'react';

export default function ScoutingForm({ onSubmit }: { onSubmit: Function }) {
    const [formData, setFormData] = useState<FormData>({
        scoutName: localStorage.getItem('scoutName')!
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const submit = () => {
        if (
            formData.teamNumber &&
            formData.drivetrain &&
            formData.intakeCapabilities &&
            formData.scoringLevels
        ) {
            setFormData({
                teamNumber: 0
            });
            console.log(formData);
            onSubmit(formData);
        } else
            setErrorMessage(
                'Please fill out all required fields (team number, drivetrain, intake capabilities, and scoring levels)'
            );
    };

    // these handlers are terrible, please fix
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleChangeSimple = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleScoringLevelsChange = (name: string, checked: boolean) => {
        if (formData.scoringLevels && !checked) {
            setFormData({
                ...formData,
                scoringLevels: formData.scoringLevels.filter((i) => i !== name)
            });
        } else if (formData.scoringLevels && checked) {
            setFormData({
                ...formData,
                scoringLevels: [...formData.scoringLevels, name]
            });
        } else {
            setFormData({
                ...formData,
                scoringLevels: [name]
            });
        }
    };

    const handleIntakeTypesChange = (name: string, checked: boolean) => {
        if (formData.intakeCapabilities && !checked) {
            setFormData({
                ...formData,
                intakeCapabilities: formData.intakeCapabilities.filter(
                    (i) => i !== name
                )
            });
        } else if (formData.intakeCapabilities && checked) {
            setFormData({
                ...formData,
                intakeCapabilities: [...formData.intakeCapabilities, name]
            });
        } else {
            setFormData({
                ...formData,
                intakeCapabilities: [name]
            });
        }
    };

    return (
        <>
            <div className="text-xl font-bold pb-2">Scout a team</div>
            <div className="grid gap-6">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right" htmlFor="teamNumber">
                        Team number
                    </Label>
                    <Input
                        name="teamNumber"
                        id="teamNumber"
                        type="number"
                        min="0"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="949"
                        className="col-span-3"
                        onChange={handleChange}
                        value={formData.teamNumber ? formData.teamNumber : ''}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Drivetrain</Label>
                    <Select
                        onValueChange={(value) =>
                            handleChangeSimple('drivetrain', value)
                        }
                        value={formData.drivetrain ? formData.drivetrain : ''}
                        defaultValue="swerve"
                    >
                        <SelectTrigger
                            className="col-span-3"
                            aria-label="Select type"
                        >
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tank">Tank</SelectItem>
                            <SelectItem value="swerve">Swerve</SelectItem>
                            <SelectItem value="mech">Mech</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Weight (lbs)</Label>
                    <Input
                        name="weight"
                        type="number"
                        min="0"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="100"
                        className="col-span-3"
                        onChange={handleChange}
                        value={formData.weight ? formData.weight : ''}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Dimensions (in, L/W)</Label>
                    <div className="col-span-3 flex flex-row items-stretch gap-x-4">
                        <Input
                            name="dimensionLength"
                            type="number"
                            min="0"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="28"
                            onChange={handleChange}
                            value={
                                formData.dimensionLength
                                    ? formData.dimensionLength
                                    : ''
                            }
                        />
                        <div>
                            <Separator orientation="vertical" />
                        </div>
                        <Input
                            name="dimensionWidth"
                            type="number"
                            min="0"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="32"
                            onChange={handleChange}
                            value={
                                formData.dimensionWidth
                                    ? formData.dimensionWidth
                                    : ''
                            }
                        />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Driver hours</Label>
                    <Input
                        name="driverHours"
                        type="number"
                        min="0"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="40"
                        className="col-span-3"
                        onChange={handleChange}
                        value={formData.driverHours ? formData.driverHours : ''}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Scoring levels</Label>
                    <div className="col-span-3">
                        <div className="items-center flex space-x-2">
                            <Checkbox
                                name="l1"
                                className="h-5 w-5"
                                aria-label="Level 1"
                                onCheckedChange={(checked) =>
                                    handleScoringLevelsChange(
                                        'l1',
                                        checked === true
                                    )
                                }
                                checked={
                                    formData.scoringLevels?.includes('l1')
                                        ? true
                                        : false
                                }
                            />
                            <div className="grid gap-1.5 leading-none ">
                                <label className="text-sm font-medium">
                                    Level 1
                                </label>
                            </div>
                        </div>

                        <div className="items-center flex space-x-2">
                            <Checkbox
                                name="l2"
                                className="h-5 w-5 my-2"
                                aria-label="Level 2"
                                onCheckedChange={(checked) =>
                                    handleScoringLevelsChange(
                                        'l2',
                                        checked === true
                                    )
                                }
                                checked={
                                    formData.scoringLevels?.includes('l2')
                                        ? true
                                        : false
                                }
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label className="text-sm font-medium  ">
                                    Level 2
                                </label>
                            </div>
                        </div>

                        <div className="items-center flex space-x-2">
                            <Checkbox
                                name="l3"
                                className="h-5 w-5"
                                aria-label="Level 3"
                                onCheckedChange={(checked) =>
                                    handleScoringLevelsChange(
                                        'l3',
                                        checked === true
                                    )
                                }
                                checked={
                                    formData.scoringLevels?.includes('l3')
                                        ? true
                                        : false
                                }
                            />
                            <div className="grid gap-1.5 leading-none ">
                                <label className="text-sm font-medium  ">
                                    Level 3
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Intake capabilities</Label>
                    <div className="col-span-3">
                        <div className="items-center flex space-x-2">
                            <Checkbox
                                name="cones"
                                className="h-5 w-5"
                                aria-label="Cones"
                                onCheckedChange={(checked) =>
                                    handleIntakeTypesChange(
                                        'cone',
                                        checked === true
                                    )
                                }
                                checked={
                                    formData.intakeCapabilities?.includes(
                                        'cone'
                                    )
                                        ? true
                                        : false
                                }
                            />
                            <div className="grid gap-1.5 leading-none ">
                                <label className="text-sm font-medium">
                                    Cones
                                </label>
                            </div>
                        </div>

                        <div className="items-center flex space-x-2 pt-2">
                            <Checkbox
                                name="cubes"
                                className="h-5 w-5"
                                aria-label="Cubes"
                                onCheckedChange={(checked) =>
                                    handleIntakeTypesChange(
                                        'cube',
                                        checked === true
                                    )
                                }
                                checked={
                                    formData.intakeCapabilities?.includes(
                                        'cube'
                                    )
                                        ? true
                                        : false
                                }
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label className="text-sm font-medium  ">
                                    Cubes
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Additional notes</Label>
                    <Textarea
                        name="notes"
                        placeholder="Team lacked spare parts"
                        className="col-span-3"
                        onChange={(e) =>
                            handleChangeSimple('notes', e.target.value)
                        }
                        value={formData.notes ? formData.notes : ''}
                    />
                </div>
                {errorMessage && (
                    <Label className="text-red-500 font-bold">
                        {errorMessage}
                    </Label>
                )}
                <Button onClick={submit}>Finalize team</Button>
            </div>
        </>
    );
}
