/**
 * External dependencies
 */
import { TextInput, View, TouchableHighlight } from 'react-native';

/**
 * WordPress dependencies
 */
import { useState, useRef, useCallback } from '@wordpress/element';
import { usePreferredColorSchemeStyle } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { ToolbarButton } from '@wordpress/components';
import {
	Icon,
	cancelCircleFilled,
	arrowLeft,
	search as searchIcon,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import styles from './style.scss';

function InserterSearchForm( { value, onChange, onFocus } ) {
	const [ isActive, setIsActive ] = useState( false );

	const inputRef = useRef();

	const searchFormStyle = usePreferredColorSchemeStyle(
		styles.searchForm,
		styles.searchFormDark
	);

	const searchFormInputStyle = usePreferredColorSchemeStyle(
		styles.searchFormInput,
		styles.searchFormInputDark
	);

	const placeholderStyle = usePreferredColorSchemeStyle(
		styles.searchFormPlaceholder,
		styles.searchFormPlaceholderDark
	);

	const onActive = useCallback(
		( active ) => {
			if ( onFocus ) {
				onFocus( active );
			}
			setIsActive( active );
		},
		[ onFocus, setIsActive ]
	);

	return (
		<TouchableHighlight accessible={ false }>
			<View style={ searchFormStyle }>
				{ isActive ? (
					<ToolbarButton
						title={ __( 'Cancel search' ) }
						icon={ arrowLeft }
						onClick={ () => {
							inputRef.current.blur();
							onChange( '' );
							onActive( false );
						} }
					/>
				) : (
					<ToolbarButton
						title={ __( 'Search block' ) }
						icon={ searchIcon }
						onClick={ () => {
							inputRef.current.focus();
							onActive( true );
						} }
					/>
				) }
				<TextInput
					ref={ inputRef }
					style={ searchFormInputStyle }
					placeholderTextColor={ placeholderStyle.color }
					onChangeText={ onChange }
					onFocus={ () => onActive( true ) }
					value={ value }
					placeholder={ __( 'Search blocks' ) }
				/>

				{ !! value && (
					<ToolbarButton
						title={ __( 'Clear search' ) }
						icon={ <Icon icon={ cancelCircleFilled } /> }
						onClick={ () => {
							onChange( '' );
						} }
					/>
				) }
			</View>
		</TouchableHighlight>
	);
}

export default InserterSearchForm;
