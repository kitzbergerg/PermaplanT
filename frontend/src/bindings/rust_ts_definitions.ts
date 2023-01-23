/*
 Generated by typeshare 1.0.0
*/

export interface NewSeedDTO {
	id?: number;
	name: string;
	variety_id: number;
	harvest_year: number;
	quantity: Quantity;
	tags: Tag[];
	use_by?: string;
	origin?: string;
	taste?: string;
	yield_?: string;
	generation?: number;
	quality?: Quality;
	price?: number;
	notes?: string;
}

export interface VarietyDto {
	id: number;
	tags: Tag[];
	species: string;
	variety?: string;
}

export enum Quality {
	Organic = "Organic",
	NotOrganic = "Not organic",
	Unknown = "Unknown",
}

export enum Quantity {
	Nothing = "Nothing",
	NotEnough = "Not enough",
	Enough = "Enough",
	MoreThanEnough = "More than enough",
}

export enum Tag {
	LeafCrops = "Leaf crops",
	FruitCrops = "Fruit crops",
	RootCrops = "Root crops",
	FloweringCrops = "Flowering crops",
	Herbs = "Herbs",
	Other = "Other",
}

