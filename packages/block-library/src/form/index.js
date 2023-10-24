/**
 * Internal dependencies
 */
import lazyLoad from '../utils/lazy-load';
import initBlock from '../utils/init-block';

import metadata from './block.json';
import save from './save';
import variations from './variations';

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

const { name } = metadata;

export { metadata, name };

export const settings = {
	edit: lazyLoad( () =>
		import( /* webpackChunkName: "form/editor" */ './edit' )
	),
	save,
	variations,
};

export const init = () => {
	// Prevent adding forms inside forms.
	const DISALLOWED_PARENTS = [ 'core/form' ];
	addFilter(
		'blockEditor.__unstableCanInsertBlockType',
		'core/block-library/preventInsertingFormIntoAnotherForm',
		(
			canInsert,
			blockType,
			rootClientId,
			{ getBlock, getBlockParentsByBlockName }
		) => {
			if ( blockType.name !== 'core/form' ) {
				return canInsert;
			}

			for ( const disallowedParentType of DISALLOWED_PARENTS ) {
				const hasDisallowedParent =
					getBlock( rootClientId )?.name === disallowedParentType ||
					getBlockParentsByBlockName(
						rootClientId,
						disallowedParentType
					).length;
				if ( hasDisallowedParent ) {
					return false;
				}
			}
			return true;
		}
	);

	return initBlock( { name, metadata, settings } );
};
